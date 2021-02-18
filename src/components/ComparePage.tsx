import styled from "@emotion/styled";
import React from "react";


const ContainerSection = styled("div")`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box; 
    background-color: white;
    margin: auto auto;
    width: 80vw;
    height: 80vh;
    padding: 5px;
    border-radius: 30px;
    border: 2px solid #bdbdbd;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

interface PageProps {

}

function ComparePage(props: PageProps) {

    return(
        <ContainerSection>

            
        </ContainerSection>
    );
}

export default ComparePage;