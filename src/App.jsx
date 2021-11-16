import React from 'react';
import {createStore,connect,Provider} from  './redux'
import {connectToUser} from './connectors/connectToUser.jsx'

let state = {
    user:{
        name:'bobojier',
        age:18
    },
    group:{
        name:"前端组"
    }
}
let reducer = (state,{type,payload})=>{
    if(type === "updateUser"){
        return {
            ...state,
            user:{
                ...state.user,
                ...payload
            }
        }
    }else{
        return state
    }
}
let store = createStore(reducer,state)

const App =() => {
    //const [appState,setAppState] = useState({user:{name:'bobojier',age:18}})
    // const contextValue ={appState,setAppState}
    return(
        <Provider store={store}>
            <BigSon/>
            <SecondSon/>
            <SmallSon/>
        </Provider>
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

const SmallSon = connect((state)=>{
    return {group:state.group}
})((group) => {
    console.log('小儿子执行了' + Math.random())
    return <section>小儿子</section>
})

//模拟异步请求
const ajax =()=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve({data: {name:"3秒后的user"}})
        },3000)
    })
}

const fetchUser = (dispatch)=>{
    ajax("/user").then((res) =>{
        dispatch({type:"updateUser",payload:res.data})
    })
}

const UserModifier = connect(null,null)(({state,dispatch}) => {  //解构赋值，此时的pros为:{x:'d',children:'hhh',updateState:dispatch({type:"updateState",payload}),state:{user:{name:'bobojier',age:18}}}
    console.log('userModifier执行了' + Math.random())
    const onClick = (e)=>{
        //fetchUser(preDispatch)
        dispatch(fetchUser)
    }
    return(
        <div>
            <div>User:{state.user.name}</div>
            <button onClick={onClick}>异步获取user</button>
        </div>
    )
})
const User =connectToUser(
    ({user}) =>{
        console.log('user执行了' + Math.random())
        return(<div>{user.name}</div>)
    }
)

export default App;
