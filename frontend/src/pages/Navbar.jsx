import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const AppNavbar = () => {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Expense Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-center">
          <Nav className="text-center">
            <Nav.Link as={Link} to="/add-expense" className="text-dark">
              Add Expense
            </Nav.Link>
            <Nav.Link as={Link} to="/overall-expenses" className="text-dark">
              Overall Expenses
            </Nav.Link>
            <Nav.Link as={Link} to="/individual-expense" className="text-dark">
              Individual Expense
            </Nav.Link>
            <Nav.Link as={Link} to="/" className="text-danger">
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
