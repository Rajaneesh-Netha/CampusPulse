import { FaLinkedin } from 'react-icons/fa';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4 className="footer-heading">Department Contacts</h4>
          <div className="contact-list">
            <p>📍 <strong>Maintenance:</strong> <a href="mailto:maintenance@cbit.ac.in">maintenance@cbit.ac.in</a></p>
            <p>🏢 <strong>Hostel:</strong> <a href="mailto:hostel@cbit.ac.in">hostel@cbit.ac.in</a></p>
            <p>💻 <strong>IT Support:</strong> <a href="mailto:itsupport@cbit.ac.in">itsupport@cbit.ac.in</a></p>
            <p>🚌 <strong>Transport:</strong> <a href="mailto:transport@cbit.ac.in">transport@cbit.ac.in</a></p>
          </div>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Support</h4>
          <p className="support-email">
            📧 <a href="mailto:support@campuspulse.app">support@campuspulse.app</a>
          </p>
          <p className="support-description">Have questions? Our team is here to help.</p>
        </div>

        <div className="footer-column">
          <h4 className="footer-heading">Connect With Us</h4>
          <div className="social-icons">
            <a href="https://www.linkedin.com/in/rajaneesh-netha-vadlagatta-b6181b323/" target="_blank" rel="noopener noreferrer" aria-label="Rajaneesh LinkedIn" className="social-icon-wrap">
              <FaLinkedin />
              <span className="social-name">Rajaneesh Netha</span>
            </a>
            <a href="https://www.linkedin.com/in/sahas-reddy-billa-42625a352/" target="_blank" rel="noopener noreferrer" aria-label="Sahas LinkedIn" className="social-icon-wrap">
              <FaLinkedin />
              <span className="social-name">Sahas Reddy</span>
            </a>
            <a href="https://www.linkedin.com/in/devaashish-satram-73309037b/" target="_blank" rel="noopener noreferrer" aria-label="Devaashish LinkedIn" className="social-icon-wrap">
              <FaLinkedin />
              <span className="social-name">Devaashish Satram</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p className="copyright">
          © 2026 CampusPulse | Built for CBIT Students | Developed by Team CampusPulse
        </p>
      </div>

      <div className="footer-background">
        <div className="footer-glow"></div>
      </div>
    </footer>
  );
}
