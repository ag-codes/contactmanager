import React, { Component } from 'react';
import { Consumer } from '../../context';
import TextInputGroup from '../layout/TextInputGroup';
import axios from 'axios';

class EditContact extends Component {
    state = {
        name: '',
        email: '',
        phone: '',
        errors: {}
    };

    async componentDidMount() {
        const { id } = this.props.match.params;
        const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
        const contact = response.data;
        this.setState({
            name: contact.name,
            email: contact.email,
            phone: contact.phone
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onSubmit = async (dispatch, e) => {
        e.preventDefault();

        const { name, email, phone } = this.state;

        // Check For Errors
        if(name === '') {
            this.setState({
                errors: {
                    name: 'Name is required'
                }
            });
            return;
        }

        if(email === '') {
            this.setState({
                errors: {
                    email: 'Email is required'
                }
            });
            return;
        }

        if(phone === '') {
            this.setState({
                errors: {
                    phone: 'Phone is required'
                }
            });
            return;
        }

        const updateContact = {
            name,
            email,
            phone
        }
        const { id } = this.props.match.params;
        const response = await axios.put
            (`https://jsonplaceholder.typicode.com/users/${id}`, updateContact);
        dispatch({ type:'UPDATE_CONTACT', payload: response.data });
        
        // Clear State
        this.setState({
            name: '',
            email: '',
            phone: '',
            errors: {}
        });

        // Redirect
        this.props.history.push('/');
    };

    render() {
        const { name, email, phone, errors } = this.state;

        return (
            <Consumer>
                {value => {
                    const { dispatch } = value;
                    return (
                        <div className="card mb-3">
                            <div className="card-header">
                            Edit Contact
                        </div>
                            <div className="card-body">
                                <form onSubmit={this.onSubmit.bind(this,dispatch)}>
                                    <TextInputGroup
                                        label="Name"
                                        name="name"
                                        placeholder="Enter Name"
                                        value={name}
                                        onChange={this.onChange}
                                        error={errors.name}
                                    />
                                    <TextInputGroup
                                        label="Email"
                                        name="email"
                                        type="email"
                                        placeholder="Enter Email"
                                        value={email}
                                        onChange={this.onChange}
                                        error={errors.email}
                                    />
                                    <TextInputGroup
                                        label="Phone"
                                        name="phone"
                                        placeholder="Enter Phone"
                                        value={phone}
                                        onChange={this.onChange}
                                        error={errors.phone}
                                    />                                                                        
                                    <input
                                        type="submit"
                                        value="Update Contact"
                                        className="btn btn-primary btn-block"
                                    />
                                </form>
                            </div>
                        </div>
                    )
                }}
            </Consumer>
        )
    }
}

export default EditContact;