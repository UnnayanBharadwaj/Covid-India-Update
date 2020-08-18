// STORE GLOBAL DATA

let _GLOBAL_DATA = {};
let _GLOBAL_INDIA_DATA;

(function() {
    const _URL = `https://api.covid19india.org/state_district_wise.json`;
    fetchIndiaData();
    fetch(_URL)
        .then(data => data.json())
        .then(data => {
            Object.keys(data).forEach(key => {
                if (key != "State Unassigned") {
                    _GLOBAL_DATA[key] = data[key];
                }
            })
            buildStateUi();
        })
        .catch(e => console.error('Cannot get data for: this api', e));
})();

function buildStateUi() {
    const selectEl = document.getElementById("states");

    for (key in _GLOBAL_DATA) {
        selectEl.options[selectEl.options.length] = new Option(key, key);
    }

    selectEl.addEventListener('change', function() {
        buildDistricts(this.value);
        let data = {
            confirmed: 0,
            recovered: 0,
            active: 0,
            deceased: 0,
            deaths : 0,
            delta_confirmed: 0,
            delta_recover: 0,
            delta_death: 0 
        }
        for (key in _GLOBAL_DATA[this.value].districtData) {
            let tmp = _GLOBAL_DATA[this.value].districtData[key];
            data.confirmed += tmp.confirmed;
            data.recovered += tmp.recovered;
            data.active += tmp.active;
            data.deceased += tmp.deceased;
            data.delta_confirmed += tmp.delta.confirmed;
            data.delta_death += tmp.delta.deaths | tmp.delta.deceased;
            data.delta_recover += tmp.delta.recovered;
            
        }
        showData(data)
    });
}

function buildDistricts(current) {
    let districtsEl = document.getElementById("districts");
    districtsEl.options.length = 1;
    for (key in _GLOBAL_DATA[current].districtData) {
        districtsEl.options[districtsEl.options.length] = new Option(key, key)
    }
    districtsEl.addEventListener('change', function() {
        showData(_GLOBAL_DATA[current].districtData[this.value])
    });
    districtsEl.selectedIndex = "0";
}

function showData(data) {
    let confirmed = document.querySelector('#confirmed_id');
    let recovered = document.querySelector('#recover_id');
    let active = document.querySelector('#active_id');
    let deaths = document.querySelector('#death_id');
    let delta_confirmed = document.querySelector('#confirmed_delta');
    let delta_recover = document.querySelector('#recover_delta');
    let delta_death = document.querySelector('#death_delta');


    loader(confirmed, data.confirmed);
    loader(recovered, data.recovered);
    loader(active, data.active);
    loader(deaths, data.deceased | data.deaths);
    console.log(data, data.delta)
    loader(delta_confirmed, data.delta ? data.delta.confirmed : (data.deltaconfirmed | data.delta_confirmed));
    loader(delta_recover,data.delta ? (data.delta.recover | data.delta.recovered) : (data.deltarecovered | data.delta_recovered | data.delta_recover));
    loader(delta_death,data.delta ? data.delta.deaths : (data.deltadeaths| data.delta_death));
}

function loader(element, value) {
    (new countUp.CountUp(element, value)).start();
}

function fetchIndiaData() {
    let _URL_ = `https://api.covid19india.org/data.json`;

    fetch(_URL_)
        .then(data => data.json())
        .then(data => {
            _GLOBAL_INDIA_DATA = data["statewise"][0];
            _GLOBAL_INDIA_DATA.delta = {
                confirmed: _GLOBAL_INDIA_DATA.deltaconfirmed,
                recover: _GLOBAL_INDIA_DATA.deltarecovered,
                deaths: _GLOBAL_INDIA_DATA.deltadeaths 
            }
            showData(_GLOBAL_INDIA_DATA);
        })
        .catch(e => console.log("Error: india fetch", e));
}