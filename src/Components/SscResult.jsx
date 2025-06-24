
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
    <div className=" bg-cyan-800 font-sans">
      <div className="container mx-auto  px-4 py-8   items-center">
        {/* Header */}
        <div className="text-center mb-8 ">
          <h1 className="text-4xl font-extrabold text-white dark:text-gray-100 mb-2">
            <i className="fas fa-graduation-cap mr-3"></i>
            SSC Result Extractor
          </h1>
          <p className="text-white dark:text-gray-300 opacity-80">Extract student details from SSC result URLs</p>
        </div>

        {/* Input Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="glass-effect rounded-xl p-6 shadow-xl dark:bg-gray-800 dark:border-gray-700">
            <div className="mb-4">
              <label htmlFor="resultUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <i className="fas fa-link mr-2"></i>Result URL
              </label>
              <input
                type="url"
                id="resultUrl"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                placeholder="Enter SSC result URL (e.g., https://example.com/result?roll=123456)"
                value={resultUrl}
                onChange={(e) => setResultUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && extractData()}
              />
            </div>
            <button
              onClick={extractData}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 hover-scale focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner w-5 h-5 border-2 border-t-2 border-white border-t-blue-300 mr-2"></div>
                  Extracting...
                </div>
              ) : (
                <>
                  <i className="fas fa-search mr-2"></i>Extract Student Details
                </>
              )}
            </button>
          </div>
        </div>


        {/* Error Section */}
        {error && (
          <div id="error" className="max-w-2xl mx-auto fade-in">
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-exclamation-triangle mr-2"></i>
                <span id="errorMessage">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {studentData && !loading && !error && (
          <div id="results" className="max-w-6xl mx-auto fade-in">
            {/* Student Details Card */}
            <div className="glass-effect rounded-xl p-6 shadow-xl mb-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  <i className="fas fa-user-graduate mr-2"></i>Student Details
                </h2>
                <button
                  onClick={exportToCSV}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                >
                  <i className="fas fa-download mr-2"></i>Export CSV
                </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4" id="studentInfo">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-white ">Candidate Name</h4>
                  <p className="text-white">{studentData.name}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900  p-4 rounded-lg">
                  <h4 className="font-semibold text-white">Roll Number</h4>
                  <p className="text-white">{studentData.rollNumber}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-white">Registration No.</h4>
                  <p className="text-white">{studentData.registrationNumber}</p>
                </div>
                <div className="bg-gray-500 p-4 rounded-lg">
                  <h4 className="font-semibold text-white">Status</h4>
                  <p className="text-white font-bold">{studentData.status}</p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900 p-4 rounded-lg col-span-full md:col-span-2">
                  <h4 className="font-semibold text-white">Exam Details</h4>
                  <p className="text-gray-100">{studentData.examName}</p>
                  <p className="text-green-100 text-sm">{studentData.examDate} | {studentData.examTime}</p>
                </div>
                <div className="bg-pink-50 dark:bg-pink-900 p-4 rounded-lg col-span-full md:col-span-2">
                  <h4 className="font-semibold text-white">Test Venue</h4>
                  <p className="text-gray-200">{studentData.testVenue}</p>
                </div>
              </div>
            </div>

            {/* Marks Breakdown */}
            <div className=" rounded-xl p-6 shadow-xl mb-6 dark:bg-gray-800 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                <i className="fas fa-chart-bar mr-2"></i>Marks Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      <th className="px-4 py-2 text-left">Subject</th>
                      <th className="px-4 py-2 text-center">Marks Obtained</th>
                      <th className="px-4 py-2 text-center">Total Marks</th>
                      <th className="px-4 py-2 text-center">Percentage</th>
                      <th className="px-4 py-2 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentData.sections.map((section, index) => (
                      <tr key={index} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                        <td className="px-4 py-2 font-medium">{section.name}</td>
                        <td className="px-4 py-2 text-center">{section.marks}</td>
                        <td className="px-4 py-2 text-center">{section.totalMarks}</td>
                        <td className="px-4 py-2 text-center">{((section.marks / section.totalMarks) * 100).toFixed(1)}%</td>
                        <td className="px-4 py-2 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getAccuracyColor(section.accuracy)}`}>
                            {section.accuracy}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-b dark:border-gray-600 bg-gray-100 dark:bg-gray-700 font-bold text-gray-800 dark:text-gray-200">
                      <td className="px-4 py-2">TOTAL</td>
                      <td className="px-4 py-2 text-center">{studentData.totalMarksObtained}</td>
                      <td className="px-4 py-2 text-center">{studentData.totalMarks}</td>
                      <td className="px-4 py-2 text-center">{((studentData.totalMarksObtained / studentData.totalMarks) * 100).toFixed(1)}%</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getAccuracyColor(studentData.overallAccuracy)}`}>
                          {studentData.overallAccuracy}%
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Question Analysis */}
            <div className=" rounded-xl p-6 shadow-xl bg-emerald-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800  mb-4">
                <i className="fas fa-analytics mr-2 text-red-500"></i>Question Analysis
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white">{studentData.totalCorrect}</div>
                  <div className="text-green-800 dark:text-green-300">Correct Answers</div>
                  <div className="text-green-600 dark:text-green-400 text-sm">{studentData.totalAttempted} Attempted</div>
                </div>
                <div className="bg-red-50 dark:bg-red-900 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white">{studentData.totalWrong}</div>
                  <div className="text-red-800 dark:text-red-300">Wrong Answers</div>
                  <div className="text-red-600 dark:text-red-400 text-sm">-{((studentData.totalWrong * 0.5)).toFixed(1)} Penalty</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-600 dark:text-gray-200">{studentData.totalUnattempted}</div>
                  <div className="text-gray-800 dark:text-gray-300">Unattempted</div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">No Penalty</div>
                </div>
              </div>

              {/* Section-wise Analysis */}
              <div className="bg-white rounded-xl p-6 shadow-xl mt-6 fade-in ">
                <h3 className="text-xl font-bold  mb-4">
                  <i className="fas fa-chart-pie mr-2 text-black"></i>Section-wise Analysis
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {studentData.sections.map((section, index) => (
                    <div key={index} className="bg-white dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-700">
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">{section.name}</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-green-600 dark:text-green-400">✓ Correct: {section.correct}</div>
                        <div className="text-red-600 dark:text-red-400">✗ Wrong: {section.wrong}</div>
                        <div className="text-gray-600 dark:text-gray-400">— Unattempted: {section.unattempted}</div>
                        <div className="text-blue-600 dark:text-blue-400">📊 Accuracy: {section.accuracy}%</div>
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
          width: 40px;
          height: 40px;
          animation: spin 2s linear infinite;
          margin: 20px auto;
        }
        .dark .loading-spinner {
          border-color: #4b5563; /* dark gray */
          border-top-color: #60a5fa; /* light blue */
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
        .hover-scale {
          transition: transform 0.2s ease;
        }
        .hover-scale:hover {
          transform: scale(1.02);
        }
        `}
      </style>
    </div>
  );
};

export default SSCResultExtractor;

