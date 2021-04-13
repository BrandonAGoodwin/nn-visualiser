import React, { useContext, useRef } from "react";
import { NNConfig } from "../../NetworkController";
import positiveLink from "../../PositiveLink.png";
import negativeLink from "../../NegativeLink.png";
import { ThemeContext } from "../../contexts/ThemeContext";

function DefaultInfoPanel() {
    // const linkSvgContainer: any = useRef<any>(null);
    // const drawDemoLink = () => {

    // }
    const { minColourName, maxColourName } = useContext(ThemeContext);

    return (
        <div>
            <h1>How To Get Started</h1>
            <p>This is a tool that lets you play with a simple neural network implementation. Below are instructions on how to get started designing your own neural network and test it's performance.</p>
            <h2>Neural Network</h2>
            <h3>Links</h3>
            {/* Maths font w? */}
            {/* Defined Term or google link for Gradient Decent*/}
            <p>Links (or edges) connect neurons in adjacent layers, each link has a weight value w that is updated by training the network using Gradient Decent.</p>
            {/* <svg
                ref={linkSvgContainer}
                width={100}
                height={40}
                style={{pointerEvents: "none" }}
                // id={'lines-container'}
            /> */}
            <h4>Magnitude</h4>
            <p>The width of a link corresponds to the absolute magnitude of it's weight. Wider links have greater absolute weight values (and therefore have a stronger influence in the destination node) than narrower links.</p>
            <h4>Positive Value Link</h4>
            <img src={positiveLink} alt="Positive link" width={100}/>
            <p>Links with a weight value &gt; 0 are {maxColourName}.</p>
            <h4>Negative Value Link</h4>
            <img src={negativeLink} alt="Negative link" width={100}/>
            <p>Links with a weight value &lt; 0 are {minColourName}.</p>
            <ul>
                <li>Fix history functionality</li>
                <li>Node representation</li>
                <li>Link representation</li>
                <li>Inputs</li>
                <li>Data set</li>
                <li>Building network</li>
                <li>Training</li>
                <li>Comparision func</li>
                <li>Tool tips</li>
            </ul>
            <p></p>
        </div>
    );
}

export default DefaultInfoPanel;