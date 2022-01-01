import Arrow from './Arrow';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import styled from 'styled-components';

function Market() {

    const location = useLocation();
    const category = location.state.category;
    const [releaseData, setReleaseData] = useState({});
    const [genreData, setGenreData] = useState({});

    console.log(genreData);

    const getRelease = async () => {
        const APIrelease = await fetch(`http://13.58.124.132/${category}/market`);
        const APIjson = await APIrelease.json();
        if (category === "movie") {
            setReleaseData(APIjson.movie_num);
            setGenreData(APIjson.genre_percent);
        }
        else {
            setReleaseData(APIjson.tvseries_num);
            setGenreData(APIjson.genre_percent);
        }
    }

    // 이 페이지가 렌더링 될 때 스크롤바는 항상 최상단으로 이동
    useEffect(() => { window.scrollTo(0, 0); }, []);
    // location으로 받은 항목이 달라지면 차트 데이터도 다시 받아오기
    useEffect(() => { getRelease(); }, [category]);

    return (
        <>
            <article>
                <div className='divContainer'>
                    <TextP>매년 넷플릭스에 릴리즈되는 한국 컨텐츠는 이렇습니다.</TextP>
                    <ReleaseChart getData={releaseData} />
                </div>
                <Arrow direction="down" />
            </article>
            <article>
                <div className='divContainer'>
                    <TextP>넷플릭스 한국 컨텐츠의 장르 분포도를 확인해보세요.</TextP>
                    <GenreChart getData={genreData} />
                </div>
                <Arrow direction="up" />
            </article>
        </>
    )
}

export default Market;

// 차트
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
function ReleaseChart({getData}) {

    const APIrelease = getData;

    const data = {
      labels: Object.keys(APIrelease),
      datasets: [
        {
          type: 'bar',
          label: '릴리즈되는 한국 컨텐츠 수',
          borderColor: '#1A374D',
          borderWidth: 5,
          backgroundColor: '#6998AB',
          data: Object.values(APIrelease),
        },
      ],
    };
  
    return (
        <ReleaseChartDiv>
            <Bar type="bar" data={data} />
        </ReleaseChartDiv>
    )
  }

function GenreChart({getData}) {

    const APIgenre = getData;

    // Chart.register(ChartDataLabels); 글로벌 플러그인

    const data = {
        labels: Object.keys(APIgenre),
        datasets: [
        {
            label: "장르 분포도",
            borderColor: 'white',
            borderWidth: 1,
            backgroundColor: [
                "#FF5959",
                "#3D087B",
                "#F43B86",
                "#FFE459",
                "#3E8E7E",
                "#9AE66E"
            ],
            data: (Object.values(APIgenre)).map((item) => { return Math.floor(item) }),
        },
        ],
    };

    const options = {
        maintainAspectRatio: false, // 가로 세로 비율 고정을 어떻게 할 것인가?
        plugins: {
            datalabels: {
                backgroundColor: "#2D0000",
                borderRadius: 5,
                padding: 10,
                color: 'white',
                textAlign: 'center',
                formatter: (value, ctx) => {
                    let index = ctx.dataIndex;
                    let label = ctx.chart.data.labels[index];
                    return label + '\n' + value + '%';
                },
                display: (context) => {
                    let index = context.dataIndex;
                    let value = context.dataset.data[index];
                    return value > 0 ? true : false;
                },
            },
            legend: {
                position: 'right',
                labels: {
                    padding: 30, // 범례 사이 간격 : 상하는 조절할 수 없다!
                    usePointStyle: true,
                    font: {
                        size: 20,
                    },
                    color: "white",
                },
            },
        },
    }

    return (
        <GenreChartDiv>
            <Doughnut 
                data={data} 
                options={options} 
                plugins={[ChartDataLabels]} 
            />
        </GenreChartDiv>
    )
}

// styled-components
const TextP = styled.p`
    font-size: 30px;
    font-weight: bold;

    text-align: left;

    margin: 0 0 0 50px;
`;

const ReleaseChartDiv = styled.div`
    background-color: white;

    width: 700px;

    margin: 50px auto 0;
    padding: 50px;
`;

const GenreChartDiv = styled.div`
    width: 600px;
    height: 400px;
  
    margin: 50px auto 50px;
    padding: 30px;
`;