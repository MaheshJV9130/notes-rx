import React from 'react'

const Button = ({children , varient="secondry" , onclick}) => {
  return (
    <button onClick={onclick} className={`p-2 rounded-lg m-2 cursor-pointer ${varient === "primary"? 'text-white bg-blue-500 hover:bg-blue-500/70':'bg-blue-100 hover:bg-red-500'}`}>{children}</button>
  )
}

export default Button