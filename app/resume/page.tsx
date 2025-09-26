import { ResumeForm } from '@/components/resumeForm/Resume'
import React from 'react'
import { FileText, Sparkles, Download, Edit3, Share2, Eye, ArrowLeft, Plus } from 'lucide-react'

const PageResume = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button & Title */}
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-blue-600 mr-2" />
                <h1 className="text-xl font-semibold text-gray-900">Add Another Resume</h1>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 text-yellow-500 mr-2" />
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-start px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Plus className="w-4 h-4 mr-3" />
                    Add New Section
                  </button>
                  <button className="w-full flex items-center justify-start px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Edit3 className="w-4 h-4 mr-3" />
                    AI Enhance
                  </button>
                  <button className="w-full flex items-center justify-start px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <FileText className="w-4 h-4 mr-3" />
                    Template Gallery
                  </button>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Pro Tips</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Use action verbs to describe your achievements
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Quantify your accomplishments with numbers
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Tailor your resume for each job application
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    Keep it concise and relevant
                  </li>
                </ul>
              </div>

              {/* Templates */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resume Templates</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-blue-500 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="p-2 text-xs text-gray-600">
                      <div className="h-1 bg-gray-400 rounded mb-1"></div>
                      <div className="h-1 bg-gray-300 rounded mb-2"></div>
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-300 rounded"></div>
                        <div className="h-1 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="p-2 text-xs text-gray-600">
                      <div className="h-1 bg-gray-300 rounded mb-1"></div>
                      <div className="h-1 bg-gray-300 rounded mb-2"></div>
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-300 rounded"></div>
                        <div className="h-1 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Professional • Modern • ATS-Friendly</p>
              </div>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Form Header */}
              <div className="border-b border-gray-200 px-8 py-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Build Your Resume</h2>
                    <p className="text-gray-600">
                      Create a professional resume that stands out to employers
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Auto-saved</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Profile Completion</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                  </div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                <ResumeForm />
              </div>
            </div>

            {/* Additional Resources */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Sparkles className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900">AI Resume Review</h3>
                </div>
                <p className="text-green-800 text-sm mb-4">
                  Get instant feedback on your resume with our AI-powered analysis tool
                </p>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                  Analyze Resume
                </button>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-200 p-6">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-purple-900">Cover Letter</h3>
                </div>
                <p className="text-purple-800 text-sm mb-4">
                  Create a matching cover letter to complement your resume
                </p>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                  Create Cover Letter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageResume