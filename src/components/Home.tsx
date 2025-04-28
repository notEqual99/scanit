import { FunctionalComponent } from 'preact';
import { useRef, useState } from 'preact/hooks';
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import { Tabs, Input, Button, message, Col, Row, Form, Select } from 'antd';
import type { TabsProps } from 'antd';
import '../css/Home.css';

const Home: FunctionalComponent = () => {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [decoded, setDecoded] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fieldTypes, setFieldTypes] = useState<Record<number, string>>({});
  
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

  const resetQr = async () => {
    setQrDataUrl('');
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer?.files.length) {
      processFile(e.dataTransfer.files[0]);
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
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
  
        const maxSize = 300;
        const minSize = 200;
  
        let scale = Math.min(maxSize / img.width, maxSize / img.height);
        if (img.width * scale < minSize || img.height * scale < minSize) {
          scale = Math.max(minSize / img.width, minSize / img.height);
        }
  
        const newWidth = img.width * scale;
        const newHeight = img.height * scale;
  
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.clearRect(0, 0, newWidth, newHeight);
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
  
        const imageData = ctx.getImageData(0, 0, newWidth, newHeight);
        const code = jsQR(imageData.data, newWidth, newHeight);
        setDecoded(code ? code.data : 'No QR code found');
      };
  
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };
  
  const generateQrFromText = async (content: string) => {
    try {
      const url = await QRCode.toDataURL(content, { width: 300 });
      setQrDataUrl(url);
    } catch (err) {
      console.error(err);
    }
  };
  
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'QR Reader',
      children: (
        <Row>
          <Col span={12}>
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
    
          <Col span={12}>
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
                  <button onClick={() => setDecoded("")}>reset</button>
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
          <Col span={16}>
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
                              Remove
                            </Button>
                          </Col>
                        </Row>
                      ))}
                      <Form.Item>
                        <Button className="qr-btn" variant="filled" onClick={() => add()}>
                          + Add Field
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
          
                <div className="flex gap-2 mb-4">
                  <Button color='green' variant="filled" htmlType="submit">
                    Generate
                  </Button>
                  
                </div>
              </Form>
            </div>
          </Col>

          <Col span={8}>
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
      alert('Copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  }

  return (
    <main className="">
      <section className="about-qr">
        <h2 className="font-bold">QR Code</h2>
        <p></p>
      </section>

      <section className="qr-tools">
        <h3 className="font-bold">QR Code Tools</h3>
        <Tabs defaultActiveKey="1" items={items} />
      </section>
    </main>
  );
}

export default Home;