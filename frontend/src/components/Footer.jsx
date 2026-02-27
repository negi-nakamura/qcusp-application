function Footer() {
    return (
        <footer className="footer bg-primary-500 h-15 flex items-center justify-center">
            <p className="text-white text-xs md:text-sm">© {new Date().getFullYear()} Quezon City University. All rights reserved.</p>
        </footer>
    );
}

export default Footer;