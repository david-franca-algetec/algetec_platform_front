import { styled } from "../../config/styles/stitches.config";

const Root = styled("table", {
  width: "100%",
  borderCollapse: "collapse",
  borderSpacing: 0,
  border: "1px solid $secondary",
  borderRadius: "4px",
  overflow: "hidden",
});

const Head = styled("thead", {
  backgroundColor: "$secondary",
  color: "$tertiary",
  fontSize: "14px",
  fontWeight: "bold",
  textAlign: "left",
});

const Body = styled("tbody", {
  backgroundColor: "$tertiary",
  color: "$secondary",
  fontSize: "14px",
  fontWeight: "normal",
  textAlign: "left",
});

const Row = styled("tr", {
  padding: "10px 0",
  borderBottom: "1px solid $secondary",
  "&:last-child": {
    borderBottom: "none",
  },
});

const Header = styled("th", {
  padding: "10px 0",
  borderBottom: "1px solid $secondary",
});

export const Box = styled("div", {});

export const Container = styled("div", {
  height: "100vh",
  width: "100vw",
  background: "$background",
});

export const Table = {
  Root,
  Head,
  Body,
  Row,
  Header,
};
