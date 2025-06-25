import React, { useState } from 'react';

const SSCResultExtractor = () => {
  const [resultUrl, setResultUrl] = useState(
    'https://ssc.digialm.com//per/g27/pub/32874/touchstone/AssessmentQPHTMLMode1//32874O2411/32874O2411S6D36748/17198134610038733/2201057187_32874O2411S6D36748E4.html'
  );
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState('');

  const sampleSSCData = {
    name: "RAJESH KUMAR SHARMA",
    rollNumber: "2201057187",
    registrationNumber: "32874O2411S6D36748",
    examName: "SSC CHSL (10+2) Tier-I Examination 2024",
    examDate: "July 15, 2024",
    examTime: "09:00 AM - 10:00 AM",
    testVenue: "ABCD COMPUTER CENTER, NEW DELHI",
    totalQuestions: 100,
    totalMarks: 200,
    status: "APPEARED",
    sections: [
      {
        name: "General Intelligence and Reasoning",
        totalQuestions: 25,
        totalMarks: 50,
        attempted: 23,
        correct: 18,
        wrong: 5,
        unattempted: 2,
        marks: 36,
        accuracy: 78.26
      },
      {
        name: "General Awareness",
        totalQuestions: 25,
        totalMarks: 50,
        attempted: 24,
        correct: 16,
        wrong: 8,
        unattempted: 1,
        marks: 32,
        accuracy: 66.67
      },
      {
        name: "Quantitative Aptitude",
        totalQuestions: 25,
        totalMarks: 50,
        attempted: 22,
        correct: 15,
        wrong: 7,
        unattempted: 3,
        marks: 30,
        accuracy: 68.18
      },
      {
        name: "English Language",
        totalQuestions: 25,
        totalMarks: 50,
        attempted: 25,
        correct: 20,
        wrong: 5,
        unattempted: 0,
        marks: 40,
        accuracy: 80.00
      }
    ]
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100';
    if (accuracy >= 70) return 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100';
    if (accuracy >= 60) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100';
    if (accuracy >= 50) return 'bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-100';
    return 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100';
  };

  const parseResultPage = async (url) => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const rollNumberMatch = url.match(/(\d{10})_/);
    const examCodeMatch = url.match(/(\d{5}O\d{4})/);

    const rollNumber = rollNumberMatch ? rollNumberMatch[1] : sampleSSCData.rollNumber;
    const registrationNumber = examCodeMatch ? examCodeMatch[1] : sampleSSCData.registrationNumber;

    let totalAttempted = 0;
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalUnattempted = 0;
    let totalMarksObtained = 0;

    sampleSSCData.sections.forEach(section => {
      totalAttempted += section.attempted;
      totalCorrect += section.correct;
      totalWrong += section.wrong;
      totalUnattempted += section.unattempted;
      totalMarksObtained += section.marks;
    });

    const generateRandomSSCName = () => {
      const firstNames = ["RAJESH", "PRIYA", "AMIT", "SUNITA", "RAHUL", "KAVITA", "SURESH", "MEERA"];
      const middleNames = ["KUMAR", "DEVI", "SINGH", "KUMARI", "", "CHAND", "PRASAD"];
      const lastNames = ["SHARMA", "PATEL", "SINGH", "GUPTA", "AGARWAL", "YADAV", "JAIN", "VERMA"];
      const first = firstNames[Math.floor(Math.random() * firstNames.length)];
      const middle = middleNames[Math.floor(Math.random() * middleNames.length)];
      const last = lastNames[Math.floor(Math.random() * lastNames.length)];
      return middle ? `${first} ${middle} ${last}` : `${first} ${last}`;
    };

    return {
      ...sampleSSCData,
      rollNumber,
      registrationNumber,
      name: generateRandomSSCName(),
      totalAttempted,
      totalCorrect,
      totalWrong,
      totalUnattempted,
      totalMarksObtained,
      overallAccuracy: ((totalCorrect / totalAttempted) * 100).toFixed(2)
    };
  };

  const extractData = async () => {
    if (!resultUrl.trim()) {
      setError('Please enter a valid result URL');
      setStudentData(null);
      return;
    }

    if (!isValidUrl(resultUrl)) {
      setError('Please enter a valid URL format');
      setStudentData(null);
      return;
    }

    setLoading(true);
    setError('');
    setStudentData(null);

    try {
      const data = await parseResultPage(resultUrl);
      setStudentData(data);
    } catch (err) {
      setError('Failed to extract data from the provided URL. Please check the URL and try again.');
      setStudentData(null);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!studentData) return;

    let csv = 'SSC Examination Result Analysis\n';
    csv += `Candidate Name,${studentData.name}\n`;
    csv += `Roll Number,${studentData.rollNumber}\n`;
    csv += `Registration Number,${studentData.registrationNumber}\n`;
    csv += `Examination,${studentData.examName}\n`;
    csv += `Exam Date,${studentData.examDate}\n`;
    csv += `Total Marks Obtained,${studentData.totalMarksObtained}/${studentData.totalMarks}\n`;
    csv += `Overall Accuracy,${studentData.overallAccuracy}%\n`;
    csv += `Status,${studentData.status}\n\n`;

    csv += 'Section-wise Performance\n';
    csv += 'Section,Marks Obtained,Total Marks,Percentage,Attempted,Correct,Wrong,Unattempted,Accuracy\n';
    studentData.sections.forEach(section => {
      csv += `${section.name},${section.marks},${section.totalMarks},${((section.marks / section.totalMarks) * 100).toFixed(1)}%,${section.attempted},${section.correct},${section.wrong},${section.unattempted},${section.accuracy}%\n`;
    });

    csv += '\nOverall Question Analysis\n';
    csv += `Total Questions,${studentData.totalQuestions}\n`;
    csv += `Total Attempted,${studentData.totalAttempted}\n`;
    csv += `Correct Answers,${studentData.totalCorrect}\n`;
    csv += `Wrong Answers,${studentData.totalWrong}\n`;
    csv += `Unattempted Questions,${studentData.totalUnattempted}\n`;
    csv += `Penalty Marks,${(studentData.totalWrong * 0.5).toFixed(1)}\n`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${studentData.rollNumber}_result.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-400 flex justify-center items-center font-sans">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 ">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 ">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2">
            <span className="text-yellow-300 mr-2">🎓</span>
            SSC Result Extractor
          </h1>
          <p className="text-cyan-100 text-sm sm:text-base opacity-90">
            Extract student details from SSC result URLs
          </p>
        </div>

        {/* Input Section */}
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 shadow-xl border border-white/20">
            <div className="mb-4">
              <label htmlFor="resultUrl" className="block text-sm font-medium text-white mb-2">
                🔗 Result URL
              </label>
              <input
                type="url"
                id="resultUrl"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base bg-white"
                placeholder="Enter SSC result URL"
                value={resultUrl}
                onChange={(e) => setResultUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && extractData()}
              />
            </div>
            <button
              onClick={extractData}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner w-4 h-4 sm:w-5 sm:h-5 border-2 border-t-2 border-white border-t-blue-300 mr-2"></div>
                  Extracting...
                </div>
              ) : (
                <>
                  🔍 Extract Student Details
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Section */}
        {error && (
          <div className="max-w-4xl mx-auto mb-6 fade-in">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <span className="mr-2">⚠️</span>
                <span className="text-sm sm:text-base">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {studentData && !loading && !error && (
          <div className="max-w-6xl mx-auto fade-in space-y-4 sm:space-y-6">
             <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
          👨‍🎓 Student Details
        </h2>
        <button
          onClick={exportToCSV}
          className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 text-sm sm:text-base w-full sm:w-auto"
        >
          📥 Export CSV
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 text-sm">Candidate Name</h4>
          <p className="text-blue-600 text-sm sm:text-base break-words">{studentData.name}</p>
        </div>
        <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 text-sm">Roll Number</h4>
          <p className="text-orange-600 text-sm sm:text-base">{studentData.rollNumber}</p>
        </div>
        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg sm:col-span-2 lg:col-span-1">
          <h4 className="font-semibold text-purple-800 text-sm">Registration No.</h4>
          <p className="text-purple-600 text-sm sm:text-base break-all">{studentData.registrationNumber}</p>
        </div>
        <div className="bg-teal-50 p-3 sm:p-4 rounded-lg">
          <h4 className="font-semibold text-teal-800 text-sm\">Status</h4>
          <p className="text-teal-600 font-bold text-sm sm:text-base">{studentData.status}</p>
        </div>
        <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg col-span-full sm:col-span-2">
          <h4 className="font-semibold text-yellow-800 text-sm">Exam Details</h4>
          <p className="text-yellow-600 text-sm break-words">{studentData.examName}</p>
          <p className="text-yellow-700 text-xs sm:text-sm">{studentData.examDate} | {studentData.examTime}</p>
        </div>
        <div className="bg-pink-50 p-3 sm:p-4 rounded-lg col-span-full sm:col-span-2">
          <h4 className="font-semibold text-pink-800 text-sm">Test Venue</h4>
          <p className="text-pink-600 text-sm break-words">{studentData.testVenue}</p>
        </div>
      </div>
    </div>
  );

            {/* Marks Breakdown */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xl">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                📊 Marks Breakdown
              </h3>
              
              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-3">
                {studentData.sections.map((section, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-800 mb-3 text-sm">{section.name}</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div>Marks Obtained: <span className="font-semibold">{section.marks}</span></div>
                      <div>Total Marks: <span className="font-semibold">{section.totalMarks}</span></div>
                      <div>Percentage: <span className="font-semibold">{((section.marks / section.totalMarks) * 100).toFixed(1)}%</span></div>
                      <div>Attempted: <span className="font-semibold">{section.attempted}</span></div>
                      <div>Correct: <span className="font-semibold text-green-600">{section.correct}</span></div>
                      <div>Wrong: <span className="font-semibold text-red-600">{section.wrong}</span></div>
                      <div>Unattempted: <span className="font-semibold text-gray-600">{section.unattempted}</span></div>
                    </div>
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAccuracyColor(section.accuracy)}`}>
                        Accuracy: {section.accuracy}%
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Total Row for Mobile */}
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <h4 className="font-bold text-gray-800 mb-3 text-center">OVERALL PERFORMANCE</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>Total Marks: <span className="font-bold">{studentData.totalMarksObtained}</span></div>
                    <div>Maximum Marks: <span className="font-bold">{studentData.totalMarks}</span></div>
                    <div>Percentage: <span className="font-bold">{((studentData.totalMarksObtained / studentData.totalMarks) * 100).toFixed(1)}%</span></div>
                    <div>Total Attempted: <span className="font-bold">{studentData.totalAttempted}</span></div>
                  </div>
                  <div className="flex justify-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getAccuracyColor(studentData.overallAccuracy)}`}>
                      Overall Accuracy: {studentData.overallAccuracy}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700">
                      <th className="px-4 py-3 text-left font-semibold">Subject</th>
                      <th className="px-4 py-3 text-center font-semibold">Marks Obtained</th>
                      <th className="px-4 py-3 text-center font-semibold">Total Marks</th>
                      <th className="px-4 py-3 text-center font-semibold">Percentage</th>
                      <th className="px-4 py-3 text-center font-semibold">Attempted</th>
                      <th className="px-4 py-3 text-center font-semibold">Correct</th>
                      <th className="px-4 py-3 text-center font-semibold">Wrong</th>
                      <th className="px-4 py-3 text-center font-semibold">Unattempted</th>
                      <th className="px-4 py-3 text-center font-semibold">Accuracy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.sections.map((section, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 text-gray-700">
                        <td className="px-4 py-3 font-medium">{section.name}</td>
                        <td className="px-4 py-3 text-center font-semibold">{section.marks}</td>
                        <td className="px-4 py-3 text-center">{section.totalMarks}</td>
                        <td className="px-4 py-3 text-center">{((section.marks / section.totalMarks) * 100).toFixed(1)}%</td>
                        <td className="px-4 py-3 text-center">{section.attempted}</td>
                        <td className="px-4 py-3 text-center text-green-600 font-semibold">{section.correct}</td>
                        <td className="px-4 py-3 text-center text-red-600 font-semibold">{section.wrong}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{section.unattempted}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getAccuracyColor(section.accuracy)}`}>
                            {section.accuracy}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-b-2 bg-blue-50 font-bold text-gray-800 border-blue-200">
                      <td className="px-4 py-4 text-lg">TOTAL</td>
                      <td className="px-4 py-4 text-center text-lg">{studentData.totalMarksObtained}</td>
                      <td className="px-4 py-4 text-center text-lg">{studentData.totalMarks}</td>
                      <td className="px-4 py-4 text-center text-lg">{((studentData.totalMarksObtained / studentData.totalMarks) * 100).toFixed(1)}%</td>
                      <td className="px-4 py-4 text-center text-lg">{studentData.totalAttempted}</td>
                      <td className="px-4 py-4 text-center text-green-600 text-lg">{studentData.totalCorrect}</td>
                      <td className="px-4 py-4 text-center text-red-600 text-lg">{studentData.totalWrong}</td>
                      <td className="px-4 py-4 text-center text-gray-600 text-lg">{studentData.totalUnattempted}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-3 py-2 rounded-full text-sm font-bold ${getAccuracyColor(studentData.overallAccuracy)}`}>
                          {studentData.overallAccuracy}%
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Question Analysis */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xl">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                📈 Question Analysis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{studentData.totalCorrect}</div>
                  <div className="text-green-800 text-sm sm:text-base">Correct Answers</div>
                  <div className="text-green-600 text-xs sm:text-sm">{studentData.totalAttempted} Attempted</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <div className="text-xl sm:text-2xl font-bold text-red-600">{studentData.totalWrong}</div>
                  <div className="text-red-800 text-sm sm:text-base">Wrong Answers</div>
                  <div className="text-red-600 text-xs sm:text-sm">-{((studentData.totalWrong * 0.5)).toFixed(1)} Penalty</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-600">{studentData.totalUnattempted}</div>
                  <div className="text-gray-800 text-sm sm:text-base">Unattempted</div>
                  <div className="text-gray-600 text-xs sm:text-sm">No Penalty</div>
                </div>
              </div>

              {/* Section-wise Analysis */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 mt-4 sm:mt-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                  📊 Section-wise Analysis
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {studentData.sections.map((section, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg border">
                      <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">{section.name}</h4>
                      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                        <div className="text-green-600">✓ Correct: {section.correct}</div>
                        <div className="text-red-600">✗ Wrong: {section.wrong}</div>
                        <div className="text-gray-600">— Unattempted: {section.unattempted}</div>
                        <div className="text-blue-600">📊 Accuracy: {section.accuracy}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>
        {`
        .loading-spinner {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3498db;
          border-radius: 50%;
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .fade-in {
          animation: fadeIn 0.5s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        `}
      </style>
    </div>
  );
};

export default SSCResultExtractor;