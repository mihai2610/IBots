import React from 'react';

const WizardFormThirdPage = props => {
    const { previousPage } = props
    return (
        <form className="jumbotron">
            <div className="form-group">
                <label for="exampleInputEmail1">Email address</label>
                <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="form-group form-check">
                <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                <label className="form-check-label" for="exampleCheck1">Check me out</label>
            </div>
            <button type="button" class="btn btn-primary" onClick={previousPage}>
                Previous
            </button>
            <button class="btn btn-primary" type="submit" onClick={props.onSubmit} >
                Submit
            </button>
        </form>
    )
}
export default (WizardFormThirdPage)