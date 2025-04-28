/** @jsxImportSource preact */
import { useState } from 'preact/hooks';
import { Menu, Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import '../css/Navbar.css';

const items = [
  { label: <a href="/">Home</a>, key: 'home' },
  { label: <a href="/about">About</a>, key: 'about' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <nav class="navbar">
      <div class="navbar-container">
        <div class="logo">
          <a href="/">Scan It</a>
        </div>

        <div class="menu-desktop">
          <Menu mode="horizontal" items={items} />
        </div>

        <div class="menu-mobile">
          <Button
            type="primary"
            icon={<MenuOutlined />}
            onClick={showDrawer}
          />
          <Drawer
            title="QRApp Menu"
            placement="right"
            onClose={onClose}
            open={open}
          >
            <Menu mode="vertical" items={items} onClick={onClose} />
          </Drawer>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
