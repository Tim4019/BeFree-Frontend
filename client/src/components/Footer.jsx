import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-text">
        © {new Date().getFullYear()} BFree — Built with ❤️
      </p>
      <div className="footer-links">
        <Link to="/resources" className="footer-link">Resources</Link>
        <Link to="/about" className="footer-link">About</Link>
        <Link to="/support" className="footer-link">Support</Link>
      </div>
    </footer>
  );
}
