import React  from 'react';
import styled from 'styled-components'


const HomePageDiv = styled.div`
    font-family: 'Old Standard TT', sans-serif;
    width: 100%;
    height: auto;
    padding: 10px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    `
const TagSearchContainer = styled.div`
    width: 100%;
    `
const HomePage = () => {
  return (<HomePageDiv>
    <TagSearchContainer>
    </TagSearchContainer>
  </HomePageDiv>)
}

export default HomePage;
