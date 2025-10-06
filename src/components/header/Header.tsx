import "./header.css";

export default function Header() {
    return (
        <>
            <div className='ae-d-flex'>
                <div className="cu-logo">
                    <div></div>
                    <div>Cognito</div>
                    <div></div>
                </div>

                <div className='ae-d-flex ae-flex-1 ae-justify-space-between'>
                    <div>Page Title</div>
                    <div><button className="ae-btn ae-btn-outline-dark">New Project</button></div>
                </div>
            </div>
        </>
    )
}
