 



 export const GetRole  = ()=>{
     const login =JSON.parse(localStorage.getItem('login') as any)
 if(login?.role === 'Admin'){
    return 'Admin'}
    else if(login?.role !== 'Admin'){
return 'all'
    }
 
    
}