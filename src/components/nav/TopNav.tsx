// noinspection CheckTagEmptyBody

import { Container, Nav, Navbar} from "react-bootstrap";
import { useDispatch } from "react-redux";

const TopNav = () => {
    const dispatch = useDispatch();
    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand>Weight Tracker</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav>
                        <Nav.Link>Add Entry</Nav.Link>
                        <Nav.Link>View All Entries</Nav.Link>
                        <Nav.Link>Charts</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default TopNav;