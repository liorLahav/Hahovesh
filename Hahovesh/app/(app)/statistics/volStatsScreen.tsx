// app/(app)/statistics/volStatsScreen.tsx

import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import tw from "twrnc";

import DateRangePicker from "./dateRangeSelector";
import VolunteerPicker from "./volSelector";
import VolunteerCard from "./volCard";
import { triggerStatisticsUpdate } from "./volStatsUpdater";
import {
  StatsPeriod,
  VolunteerStats,
} from "../../../services/volunteerAnalyticsService";
import {
  getTotalEvents,
  getTransportCounts,
  getReceiverCounts,
  getAddressCounts,
  getNoReportCount,
  getCountsByWeekday,
  getCountsByHour,
  getCountsByMonth,
  getCountsByYear,
  getActiveVolunteersCount,
} from "../../../services/globalStatsService";
import { fetchVolunteerStatsByName } from "../../../services/volunteerAnalyticsService";
import StatsHeader from "./StatsHeader";
import { StatusBar } from "expo-status-bar";

export default function MainVolunteerStats() {
  // — filter & picker state
  const [period, setPeriod] = useState<StatsPeriod>("all");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedVolunteerName, setSelectedVolunteerName] = useState<
    string | null
  >(null);

  // — global overview state
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [totalEvents, setTotalEvents] = useState(0);
  const [activeVolunteersCount, setActiveVolunteersCount] = useState(0);
  const [transportBreakdown, setTransportBreakdown] = useState<
    Record<string, number>
  >({});
  const [receiverBreakdown, setReceiverBreakdown] = useState<
    Record<string, number>
  >({});
  const [addressBreakdown, setAddressBreakdown] = useState<
    Record<string, number>
  >({});
  const [noReportCount, setNoReportCount] = useState(0);
  const [countsByWeekday, setCountsByWeekday] = useState<
    Record<string, number>
  >({});
  const [countsByHour, setCountsByHour] = useState<Record<number, number>>({});
  const [countsByMonth, setCountsByMonth] = useState<Record<string, number>>(
    {}
  );
  const [countsByYear, setCountsByYear] = useState<Record<number, number>>({});
  const [showWeekday, setShowWeekday] = useState(false);
  const [showHour, setShowHour] = useState(false);
  const [showMonth, setShowMonth] = useState(false);
  const [showYear, setShowYear] = useState(false);

  // — per‐volunteer state
  const [volLoading, setVolLoading] = useState(false);
  const [volError, setVolError] = useState<string | null>(null);
  const [volStats, setVolStats] = useState<VolunteerStats[]>([]);

  // blocks initial render until update+fetch complete
  const [initializing, setInitializing] = useState(true);

  /** 1) Fetch global overview */
  const fetchGlobalStats = async () => {
    setGlobalLoading(true);
    setGlobalError(null);
    try {
      const [
        totalRes,
        transRes,
        recvRes,
        noRepRes,
        byWeekday,
        byHour,
        byMonth,
        byYear,
      ] = await Promise.all([
        getTotalEvents(period, startDate, endDate),
        getTransportCounts(period, startDate, endDate),
        getReceiverCounts(period, startDate, endDate),
        getNoReportCount(period, startDate, endDate),
        getCountsByWeekday(period, startDate, endDate),
        getCountsByHour(period, startDate, endDate),
        getCountsByMonth(period, startDate, endDate),
        getCountsByYear(period, startDate, endDate),
      ]);

      setTotalEvents(totalRes);
      setTransportBreakdown(transRes);
      setReceiverBreakdown(recvRes);
      setAddressBreakdown(await getAddressCounts(period, startDate, endDate));
      setNoReportCount(noRepRes);

      // ← NEW: use service for active volunteers
      setActiveVolunteersCount(await getActiveVolunteersCount());

      setCountsByWeekday(byWeekday);
      setCountsByHour(byHour);
      setCountsByMonth(byMonth);
      setCountsByYear(byYear);
    } catch (e) {
      setGlobalError(e instanceof Error ? e.message : "שגיאה כללית");
      setTotalEvents(0);
      setTransportBreakdown({});
      setReceiverBreakdown({});
      setAddressBreakdown({});
      setNoReportCount(0);
      setActiveVolunteersCount(0);
      setCountsByWeekday({});
      setCountsByHour({});
      setCountsByMonth({});
      setCountsByYear({});
    } finally {
      setGlobalLoading(false);
    }
  };

  /** 2) Fetch stats for the selected volunteer */
  const fetchVolStats = async () => {
    if (!selectedVolunteerName) {
      setVolStats([]);
      return;
    }
    setVolLoading(true);
    setVolError(null);
    try {
      const stats = await fetchVolunteerStatsByName(selectedVolunteerName);
      setVolStats(stats);
    } catch (e) {
      setVolError(e instanceof Error ? e.message : "שגיאה בטעינת מתנדב");
      setVolStats([]);
    } finally {
      setVolLoading(false);
    }
  };

  /** 3) On first focus (only once), update then fetch everything */
  useFocusEffect(
    useCallback(() => {
      (async () => {
        setInitializing(true);
        await triggerStatisticsUpdate();
        await fetchGlobalStats();
        await fetchVolStats();
        setInitializing(false);
      })();
    }, [])
  );

  /** 4) When filters change (period/date), re-fetch global */
  useEffect(() => {
    fetchGlobalStats();
  }, [period, startDate, endDate]);

  /** 5) When volunteer selection changes, fetch just that */
  useEffect(() => {
    fetchVolStats();
  }, [selectedVolunteerName]);

  // If still initializing, block UI with full-screen loader
  if (initializing) {
    return (
      <SafeAreaView style={tw`flex-1 items-center justify-center bg-blue-100`}>
        <ActivityIndicator size="large" color="#1d4ed8" />
        <Text style={tw`mt-4 text-blue-800`}>מעדכן נתונים…</Text>
      </SafeAreaView>
    );
  }

  /** Helper to render a dropdown section */
  const renderDropdown = (
    title: string,
    open: boolean,
    toggle: () => void,
    content: React.ReactNode
  ) => (
    <View style={tw`bg-white rounded-lg p-4 mb-4 shadow-md`}>
      <Pressable
        onPress={toggle}
        style={tw`flex-row-reverse items-center justify-between`}
      >
        <Text style={tw`text-lg font-bold text-blue-800 text-right`}>
          {title}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={24}
          color="#1d4ed8"
        />
      </Pressable>
      {open && <View style={tw`mt-2`}>{content}</View>}
    </View>
  );

  return (
    <>
      <StatusBar backgroundColor="black" style="dark" />

      <View style={tw`flex-1 bg-blue-100`}>
        <StatsHeader />

        {/* Date Range Picker */}
        <DateRangePicker
          period={period}
          setPeriod={setPeriod}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        <ScrollView style={tw`flex-1 p-4`}>
          {/* Core Overview */}
          <View style={tw`bg-white rounded-lg p-5 mb-6 shadow-md`}>
            <Text style={tw`text-lg font-bold text-blue-800 mb-4 text-right`}>
              סקירה כללית
            </Text>
            {globalLoading ? (
              <View style={tw`items-center justify-center py-6`}>
                <ActivityIndicator size="small" color="#1d4ed8" />
                <Text style={tw`mt-3 text-gray-600 text-right`}>טוען…</Text>
              </View>
            ) : globalError ? (
              <View style={tw`bg-red-50 p-3 rounded-md border border-red-200`}>
                <Text style={tw`text-red-600 text-right`}>{globalError}</Text>
              </View>
            ) : (
              <>
                {/* total events */}
                <View style={tw`flex-row-reverse items-center justify-between mb-4`}>
                  <Text style={tw`text-gray-700 text-base`}>סה״כ אירועים:</Text>
                  <Text style={tw`text-2xl font-semibold text-gray-800`}>
                    {totalEvents}
                  </Text>
                </View>

                {/* active volunteers */}
                <View style={tw`flex-row-reverse items-center justify-between mb-5`}>
                  <Text style={tw`text-gray-700 text-base`}>
                    מתנדבים פעילים:
                  </Text>
                  <Text style={tw`text-2xl font-semibold text-gray-800`}>
                    {activeVolunteersCount}
                  </Text>
                </View>

                <View style={tw`border-t border-gray-200 my-4`} />

                {/* transport breakdown */}
                <Text style={tw`text-gray-700 mb-2 text-right font-medium`}>
                  אמצעי פינוי:
                </Text>
                {Object.entries(transportBreakdown).length > 0 ? (
                  Object.entries(transportBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([t, c]) => (
                      <View
                        key={t}
                        style={tw`flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded`}
                      >
                        <Text style={tw`text-gray-800 text-sm flex-1 text-right`}>
                          {t}
                        </Text>
                        <Text style={tw`text-blue-600 font-medium`}>{c}</Text>
                      </View>
                    ))
                ) : (
                  <Text style={tw`text-gray-500 text-sm text-right`}>
                    אין נתונים.
                  </Text>
                )}

                <View style={tw`border-t border-gray-200 my-4`} />

                {/* receiver breakdown */}
                <Text style={tw`text-gray-700 mb-2 text-right font-medium`}>
                  מקור הפנייה:
                </Text>
                {Object.entries(receiverBreakdown).length > 0 ? (
                  Object.entries(receiverBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .map(([r, c]) => (
                      <View
                        key={r}
                        style={tw`flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded`}
                      >
                        <Text style={tw`text-gray-800 text-sm flex-1 text-right`}>
                          {r}
                        </Text>
                        <Text style={tw`text-blue-600 font-medium`}>{c}</Text>
                      </View>
                    ))
                ) : (
                  <Text style={tw`text-gray-500 text-sm text-right`}>
                    אין נתונים.
                  </Text>
                )}

                <View style={tw`border-t border-gray-200 my-4`} />

                {/* no-report count */}
                <View style={tw`flex-row-reverse items-center justify-between mb-5`}>
                  <Text style={tw`text-gray-700 text-base`}>
                    דוחות ללא סיכום אירוע:
                  </Text>
                  <Text style={tw`text-red-600 font-medium`}>
                    {noReportCount}
                  </Text>
                </View>

                <View style={tw`border-t border-gray-200 my-4`} />

                {/* address breakdown */}
                <Text style={tw`text-gray-700 mb-2 text-right font-medium`}>
                  חלוקת כתובות:
                </Text>
                {Object.entries(addressBreakdown).length > 0 ? (
                  Object.entries(addressBreakdown)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([a, c]) => (
                      <View
                        key={a}
                        style={tw`flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded`}
                      >
                        <Text
                          style={tw`text-gray-800 text-sm flex-1 text-right`}
                          numberOfLines={1}
                        >
                          {a}
                        </Text>
                        <Text style={tw`text-blue-600 font-medium`}>{c}</Text>
                      </View>
                    ))
                ) : (
                  <Text style={tw`text-gray-500 text-sm text-right`}>
                    אין נתונים.
                  </Text>
                )}
                {Object.entries(addressBreakdown).length > 10 && (
                  <Text style={tw`text-gray-400 text-xs text-right mt-2`}>
                    ועוד {Object.entries(addressBreakdown).length - 10} כתובות…
                  </Text>
                )}
              </>
            )}
          </View>

          {/* breakdown dropdowns */}
          {renderDropdown(
            "אירועים לפי יום בשבוע",
            showWeekday,
            () => setShowWeekday(!showWeekday),
            Object.entries(countsByWeekday)
              .sort(([, a], [, b]) => b - a)
              .map(([day, cnt]) => (
                <View
                  key={day}
                  style={tw`flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded`}
                >
                  <Text style={tw`text-gray-800 text-sm text-right`}>
                    {day}
                  </Text>
                  <Text style={tw`text-blue-600 font-medium`}>{cnt}</Text>
                </View>
              ))
          )}

          {renderDropdown(
            "אירועים לפי שעה",
            showHour,
            () => setShowHour(!showHour),
            Object.entries(countsByHour)
              .filter(([, cnt]) => cnt >= 1)
              .sort(([, a], [, b]) => b - a)
              .map(([hour, cnt]) => (
                <View
                  key={hour}
                  style={tw`flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded`}
                >
                  <Text style={tw`text-gray-800 text-sm text-right`}>
                    {hour}:00
                  </Text>
                  <Text style={tw`text-blue-600 font-medium`}>{cnt}</Text>
                </View>
              ))
          )}

          {renderDropdown(
            "אירועים לפי חודש",
            showMonth,
            () => setShowMonth(!showMonth),
            Object.entries(countsByMonth)
              .sort()
              .map(([m, c]) => (
                <View
                  key={m}
                  style={tw`flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded`}
                >
                  <Text style={tw`text-gray-800 text-sm text-right`}>{m}</Text>
                  <Text style={tw`text-blue-600 font-medium`}>{c}</Text>
                </View>
              ))
          )}

          {renderDropdown(
            "אירועים לפי שנה",
            showYear,
            () => setShowYear(!showYear),
            Object.entries(countsByYear).map(([y, c]) => (
              <View
                key={y}
                style={tw`flex-row-reverse items-center justify-between mb-2 bg-gray-50 p-2 rounded`}
              >
                <Text style={tw`text-gray-800 text-sm text-right`}>{y}</Text>
                <Text style={tw`text-blue-600 font-medium`}>{c}</Text>
              </View>
            ))
          )}

          {/* volunteer picker & cards */}
          <VolunteerPicker
            selectedVolunteerName={selectedVolunteerName}
            onSelectVolunteer={setSelectedVolunteerName}
          />

          {selectedVolunteerName == null ? (
            <View style={tw`bg-white rounded-lg p-6 shadow-sm items-center justify-center mt-4`}>
              <Ionicons name="people" size={60} color="#93c5fd" />
              <Text style={tw`text-lg font-bold text-blue-800 mt-4 mb-2 text-center`}>
                בחר מתנדב להצגת סטטיסטיקה אישית
              </Text>
            </View>
          ) : volLoading ? (
            <View style={tw`items-center justify-center py-8`}>
              <ActivityIndicator size="large" color="#1d4ed8" />
              <Text style={tw`mt-4 text-blue-800 text-lg text-right`}>
                טוען…
              </Text>
            </View>
          ) : volError ? (
            <View style={tw`bg-red-50 p-4 rounded-lg border border-red-200 items-center my-4`}>
              <Text style={tw`text-red-700 text-lg font-bold mb-2 text-right`}>
                שגיאה
              </Text>
              <Text style={tw`text-red-600 text-right`}>{volError}</Text>
            </View>
          ) : (
            volStats.map((v) => <VolunteerCard key={v.id} volunteer={v} />)
          )}
        </ScrollView>
      </View>
    </>
  );
}
