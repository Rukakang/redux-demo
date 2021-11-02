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
const SecondSon = () => <section>二儿子<Wrapper/></section>
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

const UserModifier = ({dispatch,state}) => {
    const onChange = (e) =>{
        dispatch({type:"updateState",payload:{name:e.target.value}})
    }
    return(
        <input value={state.user.name} onChange={onChange}/>
    )
}
const Wrapper =()=>{
    const {appState,setAppState} = useContext(appContext)
    const dispatch =(action)=>{
        setAppState(reducer(appState,action))
    }
    return <UserModifier dispatch={dispatch} state={appState}/>
}

export default App;
