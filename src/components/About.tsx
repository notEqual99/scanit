import { FunctionalComponent } from 'preact';
import "../css/About.css";

const About: FunctionalComponent = () => {
  return (
    <div className="about-ctn">
      <div>
        <h2>What is a QR Code?</h2>
        <p>A QR Code (Quick Response Code) is a two-dimensional matrix barcode that stores information in a grid of black and white squares. Unlike traditional barcodes (which hold data horizontally), QR codes store data both horizontally and vertically, allowing them to encode significantly more information. They can be scanned quickly by smartphones or dedicated readers to trigger actions like opening URLs, displaying text, or connecting to Wi-Fi.</p>
      </div>
      <hr/>
      <div>
        <h2>Who Created the QR Code?</h2>
        <ul>
          <li><strong>Inventor</strong>: Masahiro Hara, an engineer at Denso Wave (a subsidiary of Toyota).</li>
          <li><strong>Year</strong>: 1994.</li>
          <li><strong>Purpose</strong>: Designed to track vehicles during manufacturing, as traditional barcodes couldn’t store enough data for Toyota’s complex production lines.</li>
        </ul>
      </div>
      <hr/>
      <div>
        <h2>Key Features of QR Codes</h2>
        <ol>
          <li><strong>High Capacity</strong>: Stores up to 7,089 numeric characters or 4,296 alphanumeric characters.</li>
          <li><strong>Error Correction</strong>: Even if 30% of the code is damaged, it can still be read.</li>
          <li><strong>Fast Scanning</strong>: Scanned from any angle (omnidirectional).</li>
          <li><strong>Versatility</strong>: Encodes URLs, text, contact info, payment details, and more.</li>
        </ol>
      </div>
      <hr/>
      <div>
        <h2>History and Evolution</h2>
        <ol>
          <li><strong>1994</strong>: Denso Wave invents QR codes for Toyota’s automotive tracking.</li>
          <li><strong>2000s</strong>: Adoption spreads to logistics, healthcare, and retail in Japan.</li>
          <li><strong>2010s</strong>: Smartphones with built-in cameras and QR readers popularize them globally.</li>
          <li><strong>2020s</strong>: Explosion in use for contactless interactions (e.g., COVID-19 menus, digital payments like Alipay/WeChat Pay, vaccine passports).
          </li>
        </ol>
      </div>
      <hr/>
      <div>
        <h2>How QR Codes Work</h2>
        <ul>
          <li><strong>Patterns</strong>: Three square "finder patterns" (corners) help scanners detect orientation.</li>
          <li><strong>Alignment Markers</strong>: Ensure accurate reading even if the code is skewed.</li>
          <li><strong>Data Cells</strong>: Black/white squares encode binary data (0s and 1s).</li>
          <li><strong>Error Correction</strong>: Reed-Solomon codes fix damaged or obscured sections.</li>
        </ul>
      </div>
      <hr/>
      <div>
        <h2>Modern Applications</h2>
        <ul>
          <li><strong>Payments</strong>: TApple Pay, Google Pay, and mobile banking apps.</li>
          <li><strong>Marketing</strong>: Ads, posters, and packaging link to websites or promotions.</li>
          <li><strong>Transportation</strong>: Boarding passes (airlines) and metro tickets.</li>
          <li><strong>Healthcare</strong>: Patient ID wristbands and vaccine records.</li>
          <li><strong>Cryptocurrency</strong>:  Wallet addresses for Bitcoin/Ethereum.</li>
        </ul>
      </div>
      <hr/>
      <div>
        <h2>Fun Facts</h2>
        <ul>
          <li>The first QR code included the kanji characters for "Toyota."</li>
          <li>Denso Wave <strong>open-sourced</strong> the technology, driving global adoption.</li>
          <li>Artist <strong>Takashi Murakami</strong> and brands like Gucci have turned QR codes into art.</li>
        </ul>
      </div>
      <hr/>
      <div>
        <h2>Future of QR Codes</h2>
        <ul>
          <li><strong>Dynamic QR Codes</strong>: Editable URLs after creation (e.g., Bitly).</li>
          <li><strong>Augmented Reality (AR)</strong>: Scanning triggers 3D animations or games.</li>
          <li><strong>Sustainability</strong>: Replacing paper menus and tickets with digital alternatives.</li>
        </ul>
        <p>QR codes revolutionized data sharing by bridging physical and digital worlds—thanks to a Toyota engineer’s quest for efficiency! 📱✨</p>
      </div>
    </div>
    
  );
}

export default About;