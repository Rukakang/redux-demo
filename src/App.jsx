import React from 'react';
import {store,appContext,connect} from  './redux'
const App =() => {
    //const [appState,setAppState] = useState({user:{name:'bobojier',age:18}})
   // const contextValue ={appState,setAppState}
    return(
        <appContext.Provider value={store}>
            <BigSon/>
            <SecondSon/>
            <SmallSon/>
        </appContext.Provider>
    )
}
//()=>xxx  句式会自动return  ()=>{}句式需要在花括号里写return
const BigSon = () => {
    console.log('大儿子执行了' + Math.random())
   return <section>大儿子<User/></section>
}
const SecondSon = () => {
    console.log('二儿子执行了' + Math.random())
    return <section>二儿子<UserModifier x={'d'}>hhh</UserModifier></section>
}


const userSelector = state=>{return {user:state.user}}
const userDispatcher = (dispatch) => {return {updateUser:(attrs)=>dispatch({type:"updateUser",payload:attrs})}}
const connectToUser = connect(userSelector,userDispatcher)

const SmallSon = connect((state)=>{
    return {group:state.group}
})((group) => {
    console.log('小儿子执行了' + Math.random())
    return <section>小儿子</section>
})

const UserModifier = connectToUser(({updateUser,user,children}) => {  //解构赋值，此时的pros为:{x:'d',children:'hhh',updateState:dispatch({type:"updateState",payload}),state:{user:{name:'bobojier',age:18}}}
    console.log('userModifier执行了' + Math.random())
    const onChange = (e) =>{
        updateUser({name:e.target.value})
    }
    return(
        <input value={user.name} onChange={onChange}/>
    )
})
const User =connectToUser(
    ({user}) =>{
        console.log('user执行了' + Math.random())
        return(<div>{user.name}</div>)
    }
)

export default App;
