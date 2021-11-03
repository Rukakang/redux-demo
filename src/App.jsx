import React,{useState,useContext} from 'react';

const appContext = React.createContext(null);
const App =() => {
    const [appState,setAppState] = useState({user:{name:'bobojier',age:18}})
    const contextValue ={appState,setAppState}
    return(
        <appContext.Provider value={contextValue}>
            <BigSon/>
            <SecondSon/>
            <SmallSon/>
        </appContext.Provider>
    )
}
const BigSon = () => <section>大儿子<User/></section>
const SecondSon = () => <section>二儿子<UserModifier x={'d'}>hhh</UserModifier></section>
const SmallSon = () => <section>小儿子</section>

const User = () =>{
    const {appState} = useContext(appContext)
    return(<div>{appState.user.name}</div>)
}
const reducer = (state,{type,payload})=>{
    if(type === "updateState"){
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


const createWrapper = (Component) =>{
    const Wrapper =(props)=>{
        const {appState,setAppState} = useContext(appContext)
        const dispatch =(action)=>{
            setAppState(reducer(appState,action))
        }
        return <Component {...props} dispatch={dispatch} state={appState}/>
    }
    return Wrapper
}
const _UserModifier = ({dispatch,state,children}) => {  //解构赋值，此时的pros为:{x:'d',children:'hhh',dispatch:(action)=>{},state:{user:{name:'bobojier',age:18}}}
    const onChange = (e) =>{
        dispatch({type:"updateState",payload:{name:e.target.value}})
    }
    return(
        <input value={state.user.name} onChange={onChange}/>
    )
}
const UserModifier = createWrapper(_UserModifier)


export default App;
