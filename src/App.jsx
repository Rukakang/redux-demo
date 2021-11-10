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

const SmallSon = () => {
    console.log('小儿子执行了' + Math.random())
    return <section>小儿子</section>
}

const UserModifier = connect()(({dispatch,state,children}) => {  //解构赋值，此时的pros为:{x:'d',children:'hhh',dispatch:(action)=>{},state:{user:{name:'bobojier',age:18}}}
    console.log('userModifier执行了' + Math.random())
    const onChange = (e) =>{
        dispatch({type:"updateState",payload:{name:e.target.value}})
    }
    return(
        <input value={state.user.name} onChange={onChange}/>
    )
})
const User =connect((state)=>{
    return {user:state.user}  //柯里化,析构出自己组件想用的那部分数据
})(
    ({user}) =>{
        console.log('user执行了' + Math.random())
        return(<div>{user.name}</div>)
    }
)

export default App;
