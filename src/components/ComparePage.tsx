import styled from "@emotion/styled";
import React from "react";


const ContainerSection = styled("div")`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box; 
    background-color: white;
    margin: 30px auto;
    min-width: 800px;
    width: auto;
    max-width: 80vw;
    height: 80vh;
    padding: 30px;
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
        <ContainerSection id="compare-page">

            
        </ContainerSection>
    );
}

export default ComparePage;