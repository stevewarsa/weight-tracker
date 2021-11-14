import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {useState} from "react";
import {DateUtils} from "../helpers/date.utils";
import {useDispatch} from "react-redux";
import {stateActions} from "../store/index";

const AddEntry = () => {
    const dispatcher = useDispatch();
    const [state, setState] = useState({dt: new Date(), lbs: 200, notes: ""});

    const handleDate = (event: any) => {
        setState(prevState => {
            return {...prevState, dt: DateUtils.parseDate(event.target.value)};
        });
    }

    const handleWeight = (event: any) => {
        setState(prevState => {
            return {...prevState, lbs: parseFloat(event.target.value)};
        });
    }

    const handleNotes = (event: any) => {
        setState(prevState => {
            return {...prevState, notes: event.target.value};
        });
    }

    const handleAddEntry = () => {
        dispatcher(stateActions.addWeightEntry(state));
    }

    return (
        <Container className="mt-3">
            <h3 className="mb-3">Add New Weight Entry</h3>
            <Row className="mb-2">
                <Col lg="4"><Form.Control type="date" placeholder="Enter Date" value={DateUtils.formatDate(state.dt)} onChange={handleDate}/></Col>
            </Row>
            <Row className="mb-2">
                <Col lg="4" className="me-0"><Form.Control type="number" value={state.lbs} placeholder="Enter Weight" onChange={handleWeight}/></Col>
                <Col><Form.Text>lbs</Form.Text></Col>
            </Row>
            <Row className="mb-2">
                <Col lg="4"><textarea className="form-control" value={state.notes} onChange={handleNotes}/></Col>
            </Row>
            <Row className="mb-2">
                <Col>
                    <Button className="btn btn-primary" onClick={handleAddEntry}>Add Entry</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default AddEntry;