import React from "react";

const Loading = (props) => (
    <svg id="Capa_1" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className={props.active?`sideboard__logo-svg ${props.extra}`:`sideboard__logo-svg inactive ${props.extra}`}>
        <g transform="rotate(180 50 50)">
            <rect ng-attr-x="{{config.x1}}" y="15" ng-attr-width="{{config.width}}" height="68.4815" fill="#93dbe9" x="15" width="10">
                <animate attributeName="height" calcMode="spline" values="50;70;30;50" keyTimes="0;0.33;0.66;1" dur="1" keySplines="0.5 0 0.5 1;0.5 0 0.5 		1;0.5 0 0.5 1" begin="-0.4s" repeatCount="indefinite">
                </animate>
            </rect>
            <rect ng-attr-x="{{config.x2}}" y="15" ng-attr-width="{{config.width}}" height="62.0761" fill="#689cc5" x="35" width="10">
                <animate attributeName="height" calcMode="spline" values="50;70;30;50" keyTimes="0;0.33;0.66;1" dur="1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.2s" repeatCount="indefinite">
                </animate>
            </rect>
            <rect ng-attr-x="{{config.x3}}" y="15" ng-attr-width="{{config.width}}" height="33.6275" fill="#5e6fa3" x="55" width="10">
                <animate attributeName="height" calcMode="spline" values="50;70;30;50" keyTimes="0;0.33;0.66;1" dur="1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.6s" repeatCount="indefinite"></animate>
            </rect>
            <rect ng-attr-x="{{config.x4}}" y="15" ng-attr-width="{{config.width}}" height="49.9256" fill="#3b4368" x="75" width="10"><animate attributeName="height" calcMode="spline" values="50;70;30;50" keyTimes="0;0.33;0.66;1" dur="1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1;0.5 0 0.5 1" begin="0s" repeatCount="indefinite"></animate>
            </rect>
        </g>
    </svg>
);
export default Loading;