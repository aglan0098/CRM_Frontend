import React, { useState, useRef, useEffect } from 'react';
import './DatePickerArabic.css';

const DatePickerArabic = ({ value, onChange, placeholder = "DD/MM/YYYY", required = false, id = "datePicker" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value && value.trim() ? new Date(value) : null);
  const [currentMonth, setCurrentMonth] = useState(
    (value && value.trim()) ? new Date(value).getMonth() : new Date().getMonth()
  );
  const [currentYear, setCurrentYear] = useState(
    (value && value.trim()) ? new Date(value).getFullYear() : new Date().getFullYear()
  );
  const [inputValue, setInputValue] = useState(value || '');

  const datePickerRef = useRef(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const daysOfWeek = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  // Generate years (current year ± 100 years)
  const currentYearNow = new Date().getFullYear();
  const years = Array.from({ length: 201 }, (_, i) => currentYearNow - 100 + i);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Update input value when value prop changes
  useEffect(() => {
    if (value && value.trim()) {
      const date = new Date(value);
      setInputValue(formatDateForDisplay(date));
      setSelectedDate(date);
    } else {
      setInputValue('');
      setSelectedDate(null);
    }
  }, [value]);

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const formatDateForDisplay = (date) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const daysInPrevMonth = getDaysInMonth(
      currentMonth === 0 ? 11 : currentMonth - 1,
      currentMonth === 0 ? currentYear - 1 : currentYear
    );

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        isCurrentMonth: false,
        isPrevMonth: true,
        date: new Date(
          currentMonth === 0 ? currentYear - 1 : currentYear,
          currentMonth === 0 ? 11 : currentMonth - 1,
          daysInPrevMonth - i
        )
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        isPrevMonth: false,
        date: new Date(currentYear, currentMonth, day)
      });
    }

    // Next month days to complete the grid
    const remainingDays = 42 - days.length; // 6 rows × 7 days = 42
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        isPrevMonth: false,
        date: new Date(
          currentMonth === 11 ? currentYear + 1 : currentYear,
          currentMonth === 11 ? 0 : currentMonth + 1,
          day
        )
      });
    }

    return days;
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setInputValue(formatDateForDisplay(date));
    const formattedDate = formatDateForInput(date);
    onChange({ target: { value: formattedDate, id } });
    setIsOpen(false); // Close dropdown after selection
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleMonthChange = (e) => {
    setCurrentMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setCurrentYear(parseInt(e.target.value));
  };

  const isDateSelected = (date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isToday = (date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="custom-datepicker-ar" ref={datePickerRef} dir="rtl">
      <div className="datepicker-input-wrapper-ar">
        <button
          type="button"
          className="datepicker-calendar-icon-ar"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="فتح التقويم"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.66667 1.66667V4.16667M13.3333 1.66667V4.16667M2.91667 7.5H17.0833M4.16667 3.33333H15.8333C16.7538 3.33333 17.5 4.07953 17.5 5V16.6667C17.5 17.5871 16.7538 18.3333 15.8333 18.3333H4.16667C3.24619 18.3333 2.5 17.5871 2.5 16.6667V5C2.5 4.07953 3.24619 3.33333 4.16667 3.33333Z" stroke="#667085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <input
          type="text"
          className="CAform-input datepicker-input-ar"
          placeholder={placeholder}
          value={inputValue}
          readOnly
          onClick={() => setIsOpen(!isOpen)}
          required={required}
          id={id}
          dir="rtl"
        />

        {isOpen && (
          <div className="datepicker-dropdown-ar">
            <div className="datepicker-header-ar">
              <div className="datepicker-nav-arrows-ar">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="datepicker-nav-button-ar"
                  aria-label="الشهر السابق"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12" fill="none">
                    <path d="M17.5 5.75047C17.5 5.37691 17.3344 5.03034 17.1775 4.77011C17.0082 4.4893 16.7806 4.19937 16.5308 3.91669C16.0298 3.34962 15.3762 2.74064 14.7418 2.18977C14.1037 1.63567 13.4678 1.12546 12.9928 0.754682C12.7549 0.568986 12.5564 0.41755 12.417 0.312239C12.3473 0.259569 12.2923 0.218397 12.2544 0.190203L12.2109 0.157818L12.1993 0.149264L12.1953 0.146304C11.8618 -0.0993576 11.3919 -0.0284673 11.1462 0.305035C10.9005 0.638521 10.9717 1.108 11.3052 1.35367L11.3179 1.36308L11.358 1.39285C11.3934 1.41925 11.4458 1.4585 11.5128 1.50911C11.6469 1.61036 11.839 1.75695 12.0698 1.93713C12.5323 2.2981 13.1464 2.79099 13.7583 3.32235C14.3739 3.85694 14.9702 4.41576 15.4067 4.90983C15.4343 4.94108 15.461 4.9718 15.4869 5.00195L0.75 5.00196C0.335787 5.00196 4.66511e-07 5.33774 5.02722e-07 5.75195C5.38934e-07 6.16617 0.335787 6.50196 0.750001 6.50196L15.4843 6.50195C15.4593 6.53116 15.4334 6.56088 15.4067 6.59111C14.9702 7.08518 14.3739 7.64401 13.7583 8.1786C13.1464 8.70995 12.5323 9.20285 12.0698 9.56382C11.839 9.74399 11.6469 9.89059 11.5128 9.99184C11.4458 10.0425 11.3934 10.0817 11.358 10.1081L11.3179 10.1379L11.3052 10.1473C10.9717 10.3929 10.9005 10.8624 11.1462 11.1959C11.3919 11.5294 11.8618 11.6003 12.1953 11.3546L12.1993 11.3517L12.2109 11.3431L12.2544 11.3107C12.2923 11.2826 12.3473 11.2414 12.417 11.1887C12.5564 11.0834 12.7549 10.932 12.9928 10.7463C13.4678 10.3755 14.1037 9.86528 14.7418 9.31118C15.3762 8.76031 16.0298 8.15133 16.5308 7.58425C16.7806 7.30158 17.0082 7.01165 17.1775 6.73083C17.3334 6.47217 17.498 6.12819 17.5 5.7572" fill="#161616" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="datepicker-nav-button-ar"
                  aria-label="الشهر التالي"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="12" viewBox="0 0 18 12" fill="none">
                    <path d="M1.95762e-05 5.75048C2.22546e-05 6.12404 0.165674 6.47061 0.322539 6.73083C0.491816 7.01165 0.719463 7.30158 0.969203 7.58426C1.4702 8.15133 2.12389 8.76031 2.75825 9.31118C3.39635 9.86528 4.03224 10.3755 4.50727 10.7463C4.74518 10.932 4.94366 11.0834 5.08306 11.1887C5.15278 11.2414 5.20778 11.2826 5.2456 11.3107L5.28917 11.3431L5.30073 11.3517L5.30474 11.3546C5.63824 11.6003 6.10818 11.5294 6.35384 11.1959C6.59949 10.8624 6.5283 10.3929 6.19483 10.1473L6.18211 10.1379L6.14206 10.1081C6.10664 10.0817 6.05422 10.0425 5.98722 9.99184C5.85319 9.89059 5.66105 9.74399 5.43021 9.56382C4.96774 9.20285 4.35365 8.70995 3.74175 8.1786C3.12613 7.64401 2.52983 7.08518 2.09333 6.59111C2.06572 6.55986 2.03901 6.52915 2.01318 6.499L16.75 6.49899C17.1642 6.49899 17.5 6.16321 17.5 5.74899C17.5 5.33478 17.1642 4.99899 16.75 4.99899L2.01572 4.999C2.04075 4.96979 2.06663 4.94006 2.09333 4.90984C2.52983 4.41577 3.12613 3.85694 3.74175 3.32235C4.35365 2.79099 4.96774 2.2981 5.43021 1.93713C5.66104 1.75695 5.85319 1.61036 5.98722 1.50911C6.05421 1.4585 6.10664 1.41925 6.14205 1.39285L6.1821 1.36308L6.19483 1.35367C6.5283 1.108 6.59949 0.638521 6.35384 0.305035C6.10817 -0.0284672 5.63824 -0.0993577 5.30474 0.146304L5.30073 0.149264L5.28917 0.157818L5.2456 0.190203C5.20778 0.218397 5.15278 0.259569 5.08306 0.312239C4.94365 0.41755 4.74518 0.568986 4.50727 0.754683C4.03224 1.12546 3.39635 1.63567 2.75825 2.18977C2.12389 2.74064 1.4702 3.34962 0.969202 3.91669C0.719463 4.19937 0.491815 4.4893 0.322539 4.77012C0.166616 5.02878 0.00201203 5.37276 3.67418e-05 5.74375" fill="#161616" />
                  </svg>
                </button>
              </div>
              <div className="datepicker-month-year-ar">
                <select
                  value={currentYear}
                  onChange={handleYearChange}
                  className="datepicker-year-select-ar"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  value={currentMonth}
                  onChange={handleMonthChange}
                  className="datepicker-month-select-ar"
                >
                  {months.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="datepicker-calendar-ar">
              <div className="datepicker-weekdays-ar">
                {daysOfWeek.map((day) => (
                  <div key={day} className="datepicker-weekday-ar">
                    {day}
                  </div>
                ))}
              </div>
              <div className="datepicker-days-ar">
                {calendarDays.map((dayObj, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`datepicker-day-ar ${!dayObj.isCurrentMonth ? 'datepicker-day-other-month-ar' : ''
                      } ${isDateSelected(dayObj.date) ? 'datepicker-day-selected-ar' : ''
                      } ${isToday(dayObj.date) && !isDateSelected(dayObj.date) ? 'datepicker-day-today-ar' : ''
                      }`}
                    onClick={() => handleDateClick(dayObj.date)}
                  >
                    {dayObj.day}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePickerArabic;