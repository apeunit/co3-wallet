import React from 'react';
// import { Button } from 'rebass';
import Icon from '../components/Icon';

const Accordion = ({ active, setActive, id, children, title }: any) => {
  // const [active, setActive] = useState(false);
  const toggleAccordion = () => {
    console.log('toggled');
    setActive(active !== id ? id : null);
  }

  return (
    <div
      className="accordion"
      style={{
        display: "flex",
        flexDirection: active ? "column" : "row"
      }}>
      <div style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "18px",
        width: "100%",
        textAlign: 'left'
      }}>
        <p
          onClick={toggleAccordion}
          style={{
            // backgroundColor: "grey",
            width: "100%",
          }}
        >
          {title}
        </p>
        <div
          onClick={toggleAccordion}
          style={{
            width: "20px",
          }}>
          <Icon name="up" style={{
            transition: "transform 0.6s ease",
            transform: active === id ? "rotate(0deg)" : "rotate(180deg)",
            color: '#777'
          }} />
        </div>
      </div>
      <div style={{ display: active === id ? 'block' : 'none' }}>
        {children}
      </div>
    </div>
  );
}

export default Accordion;
