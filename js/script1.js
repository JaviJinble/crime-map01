const mapContainer = document.getElementById('map');
const mapOption = {
    center: new kakao.maps.LatLng(36.5, 127.8), // 대한민국 중심 좌표
    level: 13 // 줌 레벨 (값이 낮을수록 더 넓은 영역을 표시)
};
const map = new kakao.maps.Map(mapContainer, mapOption);

const apiKey = "2fKY4BsNc3FoEz9F2cPc59U%2FPMtj8nl%2BsDbjf97ZSkGEBGnKBgAUW4EVr5ZFdOCycOwPEzbzESlB9iR8H9iDrA%3D%3D";

const apiUrlMap = {
    "2012": "/3074462/v1/uddi:9ce2c7eb-438b-417e-9986-e458906f2bf6_201910221524",
    "2013": "/3074462/v1/uddi:3621ad6a-4570-49bf-a09b-fe9f4a63a248_201910221518",
    "2014": "/3074462/v1/uddi:efafd73f-3310-48f8-9f56-bddc1c51f3ba_201910221541",
};

const regionCoordinates = {
    "서울": { lat: 37.56667, lng: 126.97806 },
    "부산": { lat: 35.17944, lng: 129.07556 },
    "대구": { lat: 35.87222, lng: 128.60250 },
    "인천": { lat: 37.45639, lng: 126.70528 },
    "광주": { lat: 35.15972, lng: 126.85306 },
    "대전": { lat: 36.35111, lng: 127.38500 },
    "울산": { lat: 35.53889, lng: 129.31667 },
    "부천": { lat: 37.50361, lng: 126.76611 },
    "수원": { lat: 37.26389, lng: 127.02861 },
    "성남": { lat: 37.44722, lng: 127.13750 },
    "전주": { lat: 35.82500, lng: 127.15000 },
    "안양": { lat: 37.39444, lng: 126.95556 },
    "청주": { lat: 36.64389, lng: 127.48944 },
    "마산": { lat: 35.22917, lng: 128.67500 },
    "창원": { lat: 35.22917, lng: 128.67500 },
    "광명": { lat: 37.47889, lng: 126.86444 },
    "포항": { lat: 36.01944, lng: 129.34167 },
    "안산": { lat: 37.32222, lng: 126.83083 },
    "진주": { lat: 35.18083, lng: 128.10778 },
    "고양": { lat: 37.65833, lng: 126.83056 },
    "제주": { lat: 33.50000, lng: 126.51667 },
    "목포": { lat: 34.80000, lng: 126.39556 },
    "의정부": { lat: 37.73889, lng: 127.03444 },
    "익산": { lat: 35.95000, lng: 126.95833 },
    "군산": { lat: 35.96833, lng: 126.73722 },
    "구미": { lat: 36.11944, lng: 128.34472 },
    "천안": { lat: 36.81528, lng: 127.11389 },
    "여수": { lat: 34.76056, lng: 127.66222 },
    "춘천": { lat: 37.88131, lng: 127.72997 },
    "원주": { lat: 37.34167, lng: 127.92083 },
    "평택": { lat: 36.99250, lng: 127.11306 },
    "경주": { lat: 35.85611, lng: 129.22472 },
    "김해": { lat: 35.22889, lng: 128.88944 },
    "순천": { lat: 34.95000, lng: 127.48750 },
    "군포": { lat: 37.36250, lng: 126.93333 },
    "남양주": { lat: 37.63694, lng: 127.21694 },
    "강릉": { lat: 37.75000, lng: 128.88333 },
    "충주": { lat: 36.99278, lng: 127.92611 },
    "안동": { lat: 36.56889, lng: 128.72944 },
    "경산": { lat: 35.82556, lng: 128.74167 },
    "아산": { lat: 36.79000, lng: 127.00194 },
    "거제": { lat: 34.88000, lng: 128.62167 },
    "김천": { lat: 36.14028, lng: 128.11250 },
    "정읍": { lat: 35.56806, lng: 126.85139 },
    "용인": { lat: 37.24278, lng: 127.17889 },
    "시흥": { lat: 37.38139, lng: 126.80278 },
    "파주": { lat: 37.76111, lng: 126.77778 },
    "양산": { lat: 35.33556, lng: 129.03778 },
    "이천": { lat: 37.27222, lng: 127.43500 },
    "구리": { lat: 37.59444, lng: 127.12972 },
    "서산": { lat: 36.78500, lng: 126.45056 },
    "제천": { lat: 37.13250, lng: 128.19167 },
    "논산": { lat: 36.18722, lng: 127.09889 }
};

function loadData(year) {
    const apiUrl = `https://api.odcloud.kr/api${apiUrlMap[year]}?page=1&perPage=10&serviceKey=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            return response.json();
        })
        .then(data => {
            const items = data.data;
            console.log(`${year} 데이터:`, items);

            map.setCenter(new kakao.maps.LatLng(36.5, 127.8)); // 대한민국 전체 중심으로 초기화

            const regionLabels = [];
            const crimeCounts = [];

            items.forEach(item => {
                Object.keys(regionCoordinates).forEach(city => {
                    if (item[city] && item[city] !== '0') { // 데이터가 존재하는 도시만 처리
                        const coords = regionCoordinates[city];
                        const marker = new kakao.maps.Marker({
                            position: new kakao.maps.LatLng(coords.lat, coords.lng),
                            map: map
                        });

                        const infowindow = new kakao.maps.InfoWindow({
                            content: `
                                <div style="padding:5px;font-size:0.9rem;">
                                    <strong>${city}</strong><br>
                                    <strong>범죄대분류:</strong> ${item.범죄대분류 || "정보 없음"}<br>
                                    <strong>범죄중분류:</strong> ${item.범죄중분류 || "정보 없음"}<br>
                                    <strong>발생 건수:</strong> ${item[city] || "0"}
                                </div>`
                        });

                        // 마커 이벤트 등록
                        kakao.maps.event.addListener(marker, 'mouseover', () => infowindow.open(map, marker));
                        kakao.maps.event.addListener(marker, 'mouseout', () => infowindow.close());

                        // 차트를 위한 데이터 수집
                        regionLabels.push(city);
                        crimeCounts.push(parseInt(item[city], 10));
                    }
                });
            });

            // 차트를 생성하거나 업데이트
            createChart(regionLabels, crimeCounts, year);
        })
        .catch(error => {
            console.error("API 호출 중 오류 발생:", error);
            alert(`데이터 로드 중 오류가 발생했습니다: ${error.message}`);
        });
}


// // 차트 생성 함수
// function createChart(labels, data, year) {
//     if (window.crimeChart && typeof window.crimeChart.destroy === 'function') {
//         window.crimeChart.destroy();
//     }

//     const ctx = document.getElementById('crimeChart').getContext('2d');
//     window.crimeChart = new Chart(ctx, {
//         type: 'doughnut', // 도넛 차트
//         data: {
//             labels: labels,
//             datasets: [{
//                 label: `${year}년도 범죄 발생 건수`,
//                 data: data,
//                 backgroundColor: [
//                     'rgba(54, 162, 235, 0.5)',
//                     'rgba(255, 99, 132, 0.5)',
//                     'rgba(255, 206, 86, 0.5)',
//                     'rgba(75, 192, 192, 0.5)',
//                     'rgba(153, 102, 255, 0.5)',
//                     'rgba(255, 159, 64, 0.5)'
//                 ],
//                 borderColor: [
//                     'rgba(54, 162, 235, 1)',
//                     'rgba(255, 99, 132, 1)',
//                     'rgba(255, 206, 86, 1)',
//                     'rgba(75, 192, 192, 1)',
//                     'rgba(153, 102, 255, 1)',
//                     'rgba(255, 159, 64, 1)'
//                 ],
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 legend: {
//                     display: true,
//                     position: 'top',
//                 },
//                 tooltip: {
//                     callbacks: {
//                         label: function (context) {
//                             return `건수: ${context.raw}`;
//                         }
//                     }
//                 }
//             }
//         }
//     });
// }