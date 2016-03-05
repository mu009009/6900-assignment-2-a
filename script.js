console.log('Homework 2-A...')

d3.csv('data/hubway_trips_reduced.csv',parse,dataLoaded);

function dataLoaded(err,rows){

    console.log(rows);
	
	var allTrips = crossfilter(rows);
	var DateFilter = allTrips.dimension(function(d){
		return d.startTime;
	})
	var TotalNoTrips2012 = DateFilter.filter([new Date(2012,01,01),new Date(2012,12,31)]).top(Infinity);
	console.log(TotalNoTrips2012.length);
	
	var Cross2012 = crossfilter(TotalNoTrips2012);
	var Male2012 = Cross2012.dimension(function(d){
		return d.Gender;
	})
	var TotalMale2012 = Male2012.filter("Male").top(Infinity);	
	var MaleRegister2012 = crossfilter(TotalMale2012);	
	var DimMaleRegister2012 = MaleRegister2012.dimension(function(d){
		return d.Register;
	})
	var TotalNoMaleRegistered2012 = DimMaleRegister2012.filter("Registered").top(Infinity);
	console.log(TotalNoMaleRegistered2012.length);
	
	var AllStation5 = crossfilter(TotalNoTrips2012);
	var Station52012 = AllStation5.dimension(function(d){
		return d.startStation;
	})
	var TotalStation5trip2012 = Station52012.filter("5").top(Infinity);
	console.log(TotalStation5trip2012.length);
	
	var Alltop50Duration = crossfilter(rows);
	var DurationFilter = Alltop50Duration.dimension(function(d){
		return d.duration;
	})
	var Total50TopDuration = DurationFilter.top(50)
	console.log(Total50TopDuration);
	
	DateFilter.dispose();
	Male2012.dispose();
	DimMaleRegister2012.dispose();
	Station52012.dispose();
	DurationFilter.dispose();
	
	var Allage = crossfilter(rows);
	var Agetrip = Allage.dimension(function(d){
		return d.Age;
	});
	var AgeGroup = Agetrip.group(function(d){return Math.floor(d/10);});
	console.log(AgeGroup.all());
	
	Agetrip.dispose();
	AgeGroup.dispose();
}

function parse(d){
    if(+d.duration<0) return;

    return {
        duration: +d.duration,
        startTime: parseDate(d.start_date),
        endTime: parseDate(d.end_date),
        startStation: d.strt_statn,
        endStation: d.end_statn,
		Gender : d.gender==""?"":d.gender,
		Register : d.subsc_type,
		Age : d.birth_date==""?"":2016 - +d.birth_date
    }
}

function parseDate(date){
    var day = date.split(' ')[0].split('/'),
        time = date.split(' ')[1].split(':');

    return new Date(+day[2],+day[0]-1, +day[1], +time[0], +time[1]);
}

