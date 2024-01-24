import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./CreatePostButton.css"

export const CreatePostButton: React.FC = () => {
 const history = useNavigate();

 const handleClick = () => {
   history('/createpost');
 };

 return (
   <button className="button-create" onClick={handleClick}>
    +
   </button>
 );
};