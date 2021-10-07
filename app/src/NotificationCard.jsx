
import './App.css';
import ReactNotification from 'react-notifications-component'
import { store } from 'react-notifications-component';
import "animate.css"
import 'react-notifications-component/dist/theme.css'



function DisplayNotification(){
    const handleOnClickSuccess = () =>{
        store.addNotification(
            {
                title:"Congratulations",
                message:"Login Successful",
                type:"success",
                container:"top-right",

                insert: "top",
                dismiss:{
                    duration: 2000,
                    showIcon: true
                }
            })

    }

    return(
        <div>
            <button onClick={handleOnClickSuccess}>
                Success
            </button>

        </div>
    )
}
export default App;
