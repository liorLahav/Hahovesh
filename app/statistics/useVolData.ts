import { useEffect, useState } from "react";
import { fetchVolunteers, fetchStatistics, StatsPeriod, Volunteer, VolunteerStats } from "../../Hahovesh/services/volunteerAnalyticsService";

export type DateRange = { start: Date|null; end: Date };

export type StatisticsData = {
  totalEvents:    number;
  totalSummaries: number;
  volunteerStats: VolunteerStats[];
  period:         StatsPeriod;
  dateRange:      DateRange;
};

export function useVolunteers() {
  const [list, setList]     = useState<Volunteer[]>([]);
  const [loading, setLoad]  = useState(true);
  const [error, setError]   = useState<string|null>(null);

  useEffect(()=>{
    fetchVolunteers()
      .then(v=> {
        if(v.length===0) setError("לא נמצאו מתנדבים");
        setList(v);
      })
      .catch(e=> {
        console.error(e);
        setError("שגיאה בטעינת מתנדבים");
      })
      .finally(()=>setLoad(false));
  },[]);

  return { volunteers:list, loading, error };
}

export function useStatistics(
  period: StatsPeriod,
  fullName?: string,
  startDate?: Date,
  endDate?: Date
) {
  const [data, setData]     = useState<StatisticsData|null>(null);
  const [loading, setLoad]  = useState(false);
  const [error, setError]   = useState<string|null>(null);

  useEffect(()=>{
    if(!fullName) {
      setData(null);
      setError(null);
      setLoad(false);
      return;
    }
    setLoad(true);
    fetchStatistics(period, fullName, startDate, endDate)
      .then(stats=>setData(stats))
      .catch(e=>setError(`שגיאה בטעינת נתונים: ${e.message||e}`))
      .finally(()=>setLoad(false));
  }, [period, fullName, startDate, endDate]);

  return { data, loading, error };
}