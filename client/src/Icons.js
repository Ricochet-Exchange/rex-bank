import React from "react";

const Logo = ({
  style = {},
  fill = "white",
  width = "130px",
  height = "",
  className = "",
  viewBox = "0 0 130 20",
}) => (
  <svg
    width={width}
    style={style}
    // height={height}
    viewBox={viewBox}
    xmlns="http://www.w3.org/2000/svg"
    className={`svg-icon ${className || ""}`}
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <g>
      <path
        fill={fill}
        d="M50.59,6.14c-0.94,0-1.8,0.21-2.6,0.63c-0.79,0.42-1.42,0.98-1.89,1.7c-0.83-1.55-2.25-2.32-4.25-2.32
                c-0.9,0-1.7,0.19-2.39,0.56c-0.69,0.37-1.24,0.87-1.66,1.5l-0.29-1.75h-2.95v12.94h3.34v-6.68c0-1.18,0.27-2.1,0.82-2.77
                c0.55-0.66,1.27-0.99,2.15-0.99c0.9,0,1.57,0.3,2.01,0.89c0.43,0.59,0.65,1.44,0.65,2.56v6.99h3.34v-6.68
                c0-1.18,0.27-2.1,0.82-2.77c0.55-0.66,1.27-0.99,2.18-0.99c0.89,0,1.54,0.3,1.97,0.89c0.43,0.59,0.64,1.44,0.64,2.56v6.99h3.34
                v-7.3c0-1.95-0.45-3.43-1.36-4.43C53.57,6.64,52.28,6.14,50.59,6.14z"
      />
      <path
        fill={fill}
        d="M75.03,6.14c-0.94,0-1.8,0.21-2.6,0.63c-0.79,0.42-1.42,0.98-1.89,1.7c-0.83-1.55-2.25-2.32-4.25-2.32
                c-0.9,0-1.7,0.19-2.39,0.56c-0.69,0.37-1.24,0.87-1.66,1.5l-0.29-1.75h-2.95v12.94h3.34v-6.68c0-1.18,0.27-2.1,0.82-2.77
                c0.55-0.66,1.27-0.99,2.15-0.99c0.9,0,1.57,0.3,2.01,0.89c0.43,0.59,0.65,1.44,0.65,2.56v6.99h3.34v-6.68
                c0-1.18,0.27-2.1,0.82-2.77c0.55-0.66,1.27-0.99,2.18-0.99c0.89,0,1.54,0.3,1.97,0.89c0.43,0.59,0.64,1.44,0.64,2.56v6.99h3.34
                v-7.3c0-1.95-0.45-3.43-1.36-4.43C78.02,6.64,76.72,6.14,75.03,6.14z"
      />
      <path
        fill={fill}
        d="M93.05,7c-1-0.57-2.12-0.86-3.35-0.86c-1.25,0-2.38,0.29-3.38,0.86c-1,0.57-1.8,1.37-2.39,2.39
                c-0.59,1.02-0.89,2.2-0.89,3.53c0,1.34,0.29,2.52,0.87,3.53c0.58,1.02,1.37,1.81,2.37,2.39c1,0.57,2.13,0.86,3.38,0.86
                c1.23,0,2.36-0.29,3.37-0.86c1.01-0.57,1.8-1.37,2.39-2.39c0.58-1.02,0.87-2.2,0.87-3.53c0-1.34-0.29-2.52-0.87-3.53
                C94.84,8.37,94.05,7.57,93.05,7z M91.94,15.83c-0.64,0.65-1.4,0.98-2.27,0.98c-0.87,0-1.62-0.33-2.26-0.98
                c-0.64-0.65-0.95-1.62-0.95-2.91c0-1.29,0.32-2.26,0.95-2.91c0.63-0.65,1.4-0.98,2.28-0.98c0.85,0,1.6,0.33,2.24,0.98
                s0.97,1.62,0.97,2.91C92.9,14.2,92.58,15.17,91.94,15.83z"
      />
      <path
        fill={fill}
        d="M109.55,8.22c-0.45-0.66-1.04-1.17-1.77-1.54c-0.73-0.37-1.58-0.55-2.56-0.55c-1.22,0-2.3,0.29-3.26,0.87
                c-0.96,0.58-1.71,1.38-2.27,2.4c-0.56,1.02-0.83,2.18-0.83,3.48s0.28,2.47,0.83,3.5c0.56,1.03,1.31,1.84,2.27,2.43
                c0.96,0.59,2.04,0.89,3.26,0.89c1.1,0,1.99-0.22,2.67-0.65s1.24-0.94,1.66-1.51l0.36,1.85h2.97V0.6h-3.34V8.22z M108.57,15.7
                c-0.69,0.72-1.57,1.08-2.65,1.08c-1.06,0-1.94-0.37-2.63-1.1c-0.7-0.73-1.04-1.66-1.04-2.79c0-1.13,0.35-2.05,1.04-2.77
                c0.7-0.71,1.57-1.07,2.63-1.07c1.08,0,1.96,0.36,2.65,1.08c0.69,0.72,1.03,1.65,1.03,2.78C109.6,14.05,109.26,14.97,108.57,15.7z"
      />
      <path
        fill={fill}
        d="M128.24,9.38c-0.58-1.02-1.37-1.81-2.37-2.39c-1-0.57-2.12-0.86-3.35-0.86c-1.25,0-2.38,0.29-3.38,0.86
                c-1,0.57-1.8,1.37-2.39,2.39c-0.59,1.02-0.89,2.2-0.89,3.53c0,1.34,0.29,2.52,0.87,3.53c0.58,1.02,1.37,1.81,2.37,2.39
                c1,0.57,2.13,0.86,3.38,0.86c1.23,0,2.36-0.29,3.36-0.86c1.01-0.57,1.8-1.37,2.39-2.39c0.58-1.02,0.87-2.2,0.87-3.53
                C129.11,11.58,128.82,10.4,128.24,9.38z M124.75,15.83c-0.64,0.65-1.4,0.98-2.27,0.98c-0.87,0-1.62-0.33-2.26-0.98
                c-0.64-0.65-0.95-1.62-0.95-2.91c0-1.29,0.32-2.26,0.95-2.91c0.63-0.65,1.4-0.98,2.28-0.98c0.85,0,1.6,0.33,2.24,0.98
                c0.64,0.65,0.97,1.62,0.97,2.91C125.72,14.2,125.4,15.17,124.75,15.83z"
      />
      <path
        fill={fill}
        d="M28.35,7c-1-0.57-2.12-0.86-3.35-0.86c-1.25,0-2.38,0.29-3.38,0.86c-1,0.57-1.8,1.37-2.39,2.39
                c-0.53,0.92-0.82,1.02-0.88,2.2h-2.73c-0.95,0-1.82,0.91-1.99,2.11c-0.23,0.94-0.71,1.67-1.45,2.2c-0.74,0.53-1.72,0.8-2.93,0.8
                c-1.69,0-3.01-0.57-3.97-1.71c-0.96-1.14-1.43-2.71-1.43-4.71c0-2,0.48-3.57,1.43-4.72c0.96-1.15,2.28-1.72,3.97-1.72
                c1.22,0,2.2,0.28,2.93,0.85c0.74,0.57,1.22,1.34,1.45,2.33h3.68c-0.35-1.97-1.22-3.49-2.62-4.58c-1.4-1.09-3.2-1.63-5.39-1.63
                c-1.84,0-3.43,0.4-4.75,1.2c-1.32,0.8-2.34,1.91-3.05,3.34C0.8,6.78,0.44,8.42,0.44,10.28c0,1.86,0.36,3.5,1.07,4.92
                c0.71,1.42,1.73,2.52,3.05,3.31c1.32,0.79,2.9,1.19,4.75,1.19c2.19,0,3.99-0.53,5.39-1.59c1.38-1.05,2.25-2.5,2.61-4.35h4.5l0-0.11
                h0c0-0.01,0-0.03,0-0.04l-0.03-0.9c0.03-1.18,0.35-2.09,0.95-2.71c0.63-0.65,1.4-0.98,2.28-0.98c0.85,0,1.6,0.33,2.24,0.98
                c0.64,0.65,0.97,1.62,0.97,2.91c0,1.29-0.32,2.26-0.97,2.91c-0.64,0.65-1.4,0.98-2.27,0.98v2.9c1.23,0,2.36-0.29,3.37-0.86
                c1.01-0.57,1.8-1.37,2.39-2.39c0.58-1.02,0.87-2.2,0.87-3.53c0-1.34-0.29-2.52-0.87-3.53C30.14,8.37,29.35,7.57,28.35,7z"
      />
    </g>
  </svg>
);

const Bank = ({
  style = {},
  fill = "white",
  width = "50px",
  className = "",
  viewBox = "0 0 50 50",
}) => (
  <svg
    width={width}
    style={style}
    height={width}
    viewBox={viewBox}
    xmlns="http://www.w3.org/2000/svg"
    className={`svg-icon ${className || ""}`}
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <path
      fill={fill}
      d="M39.32,19.1v-.22a2.12,2.12,0,0,0-1-1.69L26,9.59a2,2,0,0,0-2,0L12,17.45a2.2,2.2,0,0,0-.92,1.68,1.35,1.35,0,0,0,1.37,1.34h1.21a1.45,1.45,0,0,0-.1.51V33.55a1.62,1.62,0,0,0,0,.19H12.05a1.37,1.37,0,0,0-1.37,1.38v2.55A1.37,1.37,0,0,0,12.05,39H38a1.37,1.37,0,0,0,1.37-1.37V35.12A1.37,1.37,0,0,0,38,33.74H36.42a1.62,1.62,0,0,0,0-.19V21a1.45,1.45,0,0,0-.1-.51H38A1.37,1.37,0,0,0,39.32,19.1Zm-27.08,0a1,1,0,0,1,.39-.69l12-7.83a.7.7,0,0,1,.37-.09.67.67,0,0,1,.33.08l12.4,7.59a1,1,0,0,1,.38.69v.22a.19.19,0,0,1-.19.19H12.43A.18.18,0,0,1,12.24,19.13ZM26.47,33.55a.2.2,0,0,1-.2.19H23.73a.2.2,0,0,1-.2-.19V21a.2.2,0,0,1,.2-.2h2.54a.2.2,0,0,1,.2.2Zm-4-13.08a1.45,1.45,0,0,0-.1.51V33.55a1.62,1.62,0,0,0,0,.19H18.8a1.62,1.62,0,0,0,0-.19V21a1.45,1.45,0,0,0-.1-.51ZM14.72,33.55V21a.2.2,0,0,1,.2-.2h2.55a.2.2,0,0,1,.19.2V33.55a.2.2,0,0,1-.19.19H14.92A.2.2,0,0,1,14.72,33.55Zm23.42,1.57v2.55a.19.19,0,0,1-.19.19H12.05a.2.2,0,0,1-.2-.19V35.12a.2.2,0,0,1,.2-.2H38A.19.19,0,0,1,38.14,35.12Zm-5.6-1.38a.2.2,0,0,1-.2-.19V21a.2.2,0,0,1,.2-.2h2.54a.2.2,0,0,1,.2.2V33.55a.2.2,0,0,1-.2.19Zm-1.34,0H27.61a1.62,1.62,0,0,0,0-.19V21a1.45,1.45,0,0,0-.1-.51h3.71a1.45,1.45,0,0,0-.1.51V33.55A1.62,1.62,0,0,0,31.2,33.74Z"
    />
  </svg>
);

const Vault = ({
  style = {},
  fill = "white",
  width = "50px",
  className = "",
  viewBox = "0 0 50 50",
}) => (
  <svg
    width={width}
    style={style}
    height={width}
    viewBox={viewBox}
    xmlns="http://www.w3.org/2000/svg"
    className={`svg-icon ${className || ""}`}
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <path
      fill={fill}
      d="M35.36,40H15.73a5.17,5.17,0,0,1-5.16-5.17V15.19A5.17,5.17,0,0,1,15.73,10H35.36a5.17,5.17,0,0,1,5.16,5.17V34.81A5.17,5.17,0,0,1,35.36,40ZM15.73,11.59a3.6,3.6,0,0,0-3.6,3.6V34.81a3.6,3.6,0,0,0,3.6,3.6H35.36a3.6,3.6,0,0,0,3.6-3.6V15.19a3.6,3.6,0,0,0-3.6-3.6Z"
    />
    <path
      fill={fill}
      d="M21.35,27.94l-4.57,4.37a.78.78,0,0,0,.54,1.34.8.8,0,0,0,.54-.21l4.58-4.38A5,5,0,0,1,21.35,27.94Z"
    />
    <path
      fill={fill}
      d="M21.42,22a5,5,0,0,1,1.1-1.11l-4.31-4.31a.78.78,0,1,0-1.11,1.1Z"
    />
    <path
      fill={fill}
      d="M34.34,16.59a.8.8,0,0,0-1.11,0l-4.57,4.38a5.22,5.22,0,0,1,1.08,1.12l4.57-4.37A.79.79,0,0,0,34.34,16.59Z"
    />
    <path
      fill={fill}
      d="M29.67,28a5,5,0,0,1-1.1,1.11l4.31,4.31a.82.82,0,0,0,.56.23A.78.78,0,0,0,34,32.34Z"
    />
    <path
      fill={fill}
      d="M25.55,30.76A5.76,5.76,0,1,1,31.3,25,5.77,5.77,0,0,1,25.55,30.76Zm0-10.27A4.51,4.51,0,1,0,30.05,25,4.51,4.51,0,0,0,25.55,20.49Z"
    />
    <circle fill={fill} cx="25.55" cy="25" r="2.31" />
    <path
      fill={fill}
      d="M10.1,20.29a.63.63,0,0,1-.62-.63v-2.5a.63.63,0,0,1,1.25,0v2.5A.63.63,0,0,1,10.1,20.29Z"
    />
    <path
      fill={fill}
      d="M10.1,33.72a.63.63,0,0,1-.62-.63v-2.5a.63.63,0,0,1,1.25,0v2.5A.63.63,0,0,1,10.1,33.72Z"
    />
  </svg>
);

const Arrowdown = ({
  style = {},
  fill = "white",
  width = "15.603",
  height = "9.052",
  className = "",
  viewBox = "0 0 15.603 9.052",
}) => (
  <svg
    width={width}
    style={style}
    height={height}
    viewBox={viewBox}
    xmlns="http://www.w3.org/2000/svg"
    className={`svg-icon ${className || ""}`}
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <path
      id="Path_104"
      data-name="Path 104"
      d="M0,0,6.24,6.722,0,12.775"
      transform="translate(14.189 1.414) rotate(90)"
      fill="none"
      stroke={fill}
      strokeLinecap="round"
      strokeMiterlimit="10"
      strokeWidth="2"
    />
  </svg>
);

const Vmark = ({
  style = {},
  fill = "#69eaae",
  width = "29.289",
  height = "20",
  className = "",
  viewBox = "0 0 29.289 20",
}) => (
  <svg
    width={width}
    style={style}
    height={height}
    viewBox={viewBox}
    xmlns="http://www.w3.org/2000/svg"
    className={`svg-icon ${className || ""}`}
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <g id="Group_159" transform="translate(-627.931 -568.38)">
      <path id="Path_101" d="M637.744,588.38l-9.448-10a1.338,1.338,0,0,1,1.945-1.837l7.627,8.075,17.1-15.878a1.338,1.338,0,1,1,1.82,1.961Z" fill={fill}/>
    </g>
  </svg>
);

const Xmark = ({
  style = {},
  fill = "#4f56b5",
  width = "30.253",
  height = "30.252",
  className = "",
  viewBox = "0 0 30.253 30.252",
}) => (
  <svg
    width={width}
    style={style}
    height={height}
    viewBox={viewBox}
    xmlns="http://www.w3.org/2000/svg"
    className={`svg-icon ${className || ""}`}
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
  <path id="Path_99"  d="M570.593,575.977l13.419-13.418a1,1,0,1,0-1.414-1.415l-13.419,13.419-13.42-13.419a1,1,0,0,0-1.414,1.415l13.42,13.418L554.345,589.4a1,1,0,0,0,1.414,1.415l13.42-13.419L582.6,590.811a1,1,0,1,0,1.414-1.415Z" transform="translate(-554.052 -560.852)" fill={fill}/>
  </svg>
);

export default { Logo, Bank, Vault, Arrowdown, Vmark, Xmark };