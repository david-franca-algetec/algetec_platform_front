import { styled } from "../../config/styles/stitches.config";

export const ErrorContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  background: "$background",

  "& img": {
    width: "100%",
    maxWidth: "400px",
  },
});
