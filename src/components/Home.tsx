import { FunctionalComponent } from 'preact';
import { useRef, useState } from 'preact/hooks';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { Tabs, Input, Button, message, Col, Row, Form, Select } from 'antd';
import { ColorPicker, Space, ColorPickerProps, GetProp } from 'antd';
import type { TabsProps } from 'antd';
import '../css/Home.css';

type Color = GetProp<ColorPickerProps, 'value'>;

const Home: FunctionalComponent = () => {
  const DEFAULT_DOT_COLOR = '#000000';
  const DEFAULT_BG_COLOR = '#ffffff';
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [decoded, setDecoded] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fieldTypes, setFieldTypes] = useState<Record<number, string>>({});
  const [dotColor, setDotColor] = useState<Color>(DEFAULT_DOT_COLOR);
  const [qrBgColor, setQrBgColor] = useState<Color>(DEFAULT_BG_COLOR);
  
  const downloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qr-code.png';
    a.click();
  };
  
  const copyQr = async () => {
    if (!qrDataUrl) return;
    const blob = await (await fetch(qrDataUrl)).blob();
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
    message.success('QR code copied to clipboard');
  };

  const resetQr = () => {
    setQrDataUrl('');
    message.info('QR code cleared');
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer?.files.length) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        processFile(file);
      } else {
        message.error('Please drop an image file');
      }
    }
  };
  
  const handleSelect = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.files?.length) {
      processFile(target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) {
          message.error('Canvas reference not found');
          return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          message.error('Could not get canvas context');
          return;
        }
  
        const maxSize = 300;
        const minSize = 200;
  
        let scale = Math.min(maxSize / img.width, maxSize / img.height);
        if (img.width * scale < minSize || img.height * scale < minSize) {
          scale = Math.max(minSize / img.width, minSize / img.height);
        }
  
        const newWidth = Math.floor(img.width * scale);
        const newHeight = Math.floor(img.height * scale);
  
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.clearRect(0, 0, newWidth, newHeight);
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
        try {
          const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
          const code = jsQR(imageData.data, newWidth, newHeight);
          
          if (code) {
            setDecoded(code.data);
            message.success('QR code successfully scanned');
          } else {
            setDecoded('No QR code found');
            message.warning('No QR code found in the image');
          }
        } catch (err) {
          console.error('Error processing QR code:', err);
          message.error('Error processing the image');
        }
      };
      
      img.onerror = () => {
        message.error('Failed to load the image');
      };
  
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    
    reader.onerror = () => {
      message.error('Failed to read the file');
    };
    
    reader.readAsDataURL(file);
  };

  const handleResetColors = () => {
    setDotColor(DEFAULT_DOT_COLOR);
    setQrBgColor(DEFAULT_BG_COLOR);
    message.info('Colors reset to default');
  };
  
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'QR Reader',
      children: (
        <Row>
          <Col span={12} xs={24} md={12}>
            <div className="qr-gen-body space-y-4">
              <div
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                style={{
                  border: '2px dashed #ccc',
                  padding: '24px',
                  textAlign: 'center',
                  position: 'relative', 
                  minHeight: '300px', 
                  overflow: 'auto',
                }}
              >
                <p>Drag & drop QR image here</p>

                <canvas
                  ref={canvasRef}
                  style={{
                    display: decoded ? 'block' : 'none',
                    margin: '16px auto 0',
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />

              </div>
              <p style={{ textAlign: 'center' }}>or</p>
              <Input type="file" accept="image/*" onChange={handleSelect} />
            </div>
          </Col>
    
          <Col span={12} xs={24} md={12}>
            <div className="result-ctn">
              {decoded && (
                <div>
                  <h2>Result</h2>
                  <p>
                    {formatDecodedText(decoded)}
                  </p>
                  <button className="qr-btn" onClick={() => copyToClipboard(decoded)}>
                    copy
                  </button>
                  <button onClick={() => {
                    setDecoded("");
                    message.info('QR result cleared');
                  }}>reset</button>
                  <hr/>
                </div>
              )}
            </div>
          </Col>
        </Row>
      ),
    }
    ,
    {
      key: '2',
      label: 'QR Generator',
      children: (
        <Row>
          <Col span={16} xs={24} md={12}>
            <div className="qr-gen-body space-y-4">
              <Form
                layout="vertical"
                onFinish={async (values: { fields: { type: string; value: string }[] }) => {
                  const combined = values.fields
                    .map(({ type, value }) => `${type}: ${value};`)
                    .join('\n');
                  await generateQrFromText(combined);
                }}
              >
                <Form.List name="fields" initialValue={[{ type: 'URL', value: '' }]}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Row gutter={8} key={key} align="middle">
                          <Col span={6}>
                            <Form.Item
                              {...restField}
                              name={[name, 'type']}
                              rules={[
                                { required: true, message: 'Enter a value' }
                              ]}
                            >
                              <Select 
                                placeholder="Select type"
                                onChange={(value) => {
                                  setFieldTypes((prev) => ({ ...prev, [name]: value }));
                                }}
                              >
                              <Select.Option value="URL">URL</Select.Option>
                              <Select.Option value="Email">Email</Select.Option>
                              <Select.Option value="SMS">SMS</Select.Option>
                              <Select.Option value="Subject">Subject</Select.Option>
                              <Select.Option value="Phone">Phone</Select.Option>
                              <Select.Option value="Note">Note</Select.Option>
                              <Select.Option value="Name">Name</Select.Option>
                              <Select.Option value="Company">Company</Select.Option>
                              <Select.Option value="Address">Address</Select.Option>
                              <Select.Option value="Message">Message</Select.Option>
                              <Select.Option value="Password">Password</Select.Option>
                              <Select.Option value="Date">StartDate</Select.Option>
                              <Select.Option value="Date">EndDate</Select.Option>
                              <Select.Option value="Note">Note</Select.Option>
                              {/* Add more options as needed */}
                              </Select>
                            </Form.Item>
                          </Col>
                          <Col span={14}>
                            <Form.Item
                              {...restField}
                              name={[name, 'value']}
                              rules={[{ required: true, message: 'Enter a value' }]}
                            >
                              <Input
                                placeholder="Enter value"
                                type={
                                  fieldTypes[name] === 'Email' ? 'email' :
                                  fieldTypes[name] === 'Phone' ? 'number' :
                                  fieldTypes[name] === 'URL' ? 'url' :
                                  'text'
                                }
                              />
                            </Form.Item>
                          </Col>
                          <Col span={4}>
                            <Button className="remove-btn" onClick={() => remove(name)} danger>
                              X
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Form.Item>
                        <Button className="qr-btn" onClick={() => add()}>
                          + Add Field
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
          
                <Row gutter={8} justify="center">
                  <div className="color-ctn">
                    <p><strong>QR Code Colors</strong></p>
                    <p style={{ fontSize: '0.9em', color: '#666' }}>Dot Color | Background Color</p>
                  </div>
                </Row>
                <Row gutter={8} justify="center">
                  <Col span={7}></Col>
                  <Col span={3}>
                    <Form.Item>
                    <Space>
                      <ColorPicker
                        value={dotColor}
                        onChange={(color) => {
                          setDotColor(color.toHexString());
                        }}
                      />
                    </Space>
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Form.Item>
                    <Space>
                      <ColorPicker
                        value={qrBgColor}
                        onChange={(color) => {
                          setQrBgColor(color.toHexString());
                        }}
                      />
                    </Space>
                    </Form.Item>
                  </Col>
                  <Col span={3}>
                    <Button shape="circle" title="Reset colors" onClick={handleResetColors} icon={<span role="img" aria-label="Reset colors">🔄</span>} />
                  </Col>
                  <Col span={7}></Col>
                </Row>

                <div className="flex gap-2 mb-4">
                  <Button type="primary" htmlType="submit">
                    Generate QR Code
                  </Button>
                </div>
              </Form>
            </div>
          </Col>

          <Col span={8} xs={24} md={12}>
            <div className="generated-ctn">
              <div className="generated-qr">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Generated QR"
                    width={300}
                    height={300}
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <img 
                    src="https://api.iconify.design/mdi:qrcode.svg?color=gray&width=100" 
                    alt="Placeholder QR"
                    style={{ marginBottom: '10px' }}
                  />
                )}
              </div>

              <div className="generated-btn">
                <Button className="qr-btn" onClick={downloadQr} disabled={!qrDataUrl}>
                  Download
                </Button>
                <Button className="qr-btn" onClick={copyQr} disabled={!qrDataUrl}>
                  Copy QR
                </Button>
                <Button className="qr-btn" onClick={resetQr} disabled={!qrDataUrl}>
                  Clear
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      ),
    }
  ];

  const generateQrFromText = async (content: string): Promise<void> => {
    try {
      const options = {
        width: 300,
        margin: 2,
        color: {
          dark: dotColor as string,
          light: qrBgColor as string,
        },
      };
      
      const url = await QRCode.toDataURL(content, options);
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
      message.error('Failed to generate QR code');
    }
  };

  function formatDecodedText(decoded: string) {
    const parts = decoded.split(';').filter(Boolean);
    return parts.map((part, index) => {
      const [key, ...rest] = part.split(':');
      return (
        <span key={index}>
          <strong>{key}</strong>{rest.length > 0 ? ': ' + rest.join(':') : ''}
          {<br/>}
        </span>
      );
    });
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      message.success('Copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy: ', err);
      message.error('Failed to copy to clipboard');
    });
  }

  return (
    <main className="">
      <section className="about-qr">
        <h2 className="font-bold">QR Code Generator & Reader</h2>
      </section>

      <section className="qr-tools">
        <h3 className="font-bold">QR Code Tools</h3>
        <Tabs defaultActiveKey="1" items={items} />
      </section>
    </main>
  );
}

export default Home;