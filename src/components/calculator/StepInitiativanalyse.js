import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { FaFileUpload, FaCheckCircle, FaExclamationTriangle, FaHourglassHalf, FaLink } from 'react-icons/fa';
import InfoIcon from '../layout/InfoIcon';
import Drawer from '../layout/Drawer';
import CustomPolarChart from '../charts/CustomPolarChart';
import NivoLikeMarimekkoChart from '../charts/NivoLikeMarimekkoChart';
import groupTitles from '../../data/groupTitles';
import { categoryDescriptions } from '../../data/descriptions';
import { uploadDocument, fetchDocuments, mapDocumentsToAnswer } from '../../api';

// --- Sub-component: DocumentationSidebar ---
function DocumentationSidebar({ companyId, year, topic, documents, onUploadSuccess, progressPercentage }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!companyId || !year) {
      alert("Virksomheds-ID eller årstal mangler. Prøv at genindlæse siden.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('company', companyId);
    formData.append('year', year);
    formData.append('topic', topic);

    setIsUploading(true);
    try {
      await uploadDocument(formData);
      onUploadSuccess(); // Refresh list
    } catch (error) {
      alert(`Upload fejlede: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const pendingDocs = documents.filter(d => d.status === 'pending');
  const checkedDocs = documents.filter(d => d.status !== 'pending');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return <FaCheckCircle className="esg-text-green-500" title="Godkendt" />;
      case 'incomplete': return <FaExclamationTriangle className="esg-text-red-500" title="Mangelfuldt" />;
      default: return <FaHourglassHalf className="esg-text-gray-400" title="Ikke-tjekket" />;
    }
  };

  return (
    <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md esg-sticky esg-top-8">
      <h2 className="esg-text-lg esg-font-bold esg-mb-4 esg-border-b esg-pb-2">Dokumentation</h2>
      
      {/* Progress Section */}
      <div className="esg-mb-6">
        <div className="esg-flex esg-justify-between esg-items-center esg-mb-1">
          <span className="esg-text-sm esg-font-medium esg-text-gray-700">Dokumentationsgrad</span>
          <span className="esg-text-sm esg-font-medium esg-text-blue-700">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="esg-w-full esg-bg-gray-200 esg-rounded-full esg-h-2.5">
          <div className="esg-bg-blue-600 esg-h-2.5 esg-rounded-full esg-transition-all esg-duration-500" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      {/* Upload Area */}
      <div className="esg-mb-6">
        <label className={`esg-flex esg-flex-col esg-items-center esg-px-4 esg-py-4 esg-bg-gray-50 esg-text-blue-600 esg-rounded-lg esg-border-2 esg-border-dashed esg-border-blue-300 esg-cursor-pointer hover:esg-bg-blue-50 esg-transition-colors ${isUploading ? 'esg-opacity-50 esg-cursor-not-allowed' : ''}`}>
          <FaFileUpload className="esg-w-6 esg-h-6 esg-mb-1" />
          <span className="esg-text-sm esg-font-bold">{isUploading ? 'Uploader...' : 'Upload dokument'}</span>
          <input type='file' className="esg-hidden" onChange={handleFileChange} disabled={isUploading} />
        </label>
      </div>

      {/* Uploaded (Pending) Documentation */}
      <div className="esg-mb-6">
        <h3 className="esg-text-sm esg-font-bold esg-text-gray-500 esg-uppercase esg-mb-3">Uploadet dokumentation</h3>
        <ul className="esg-space-y-2">
          {pendingDocs.length === 0 ? (
            <li className="esg-text-xs esg-text-gray-400 esg-italic">Ingen nye dokumenter</li>
          ) : pendingDocs.map(doc => (
            <li key={doc.id} className="esg-flex esg-items-center esg-justify-between esg-p-2 esg-bg-gray-50 esg-rounded esg-text-xs">
              <span className="esg-truncate esg-max-w-[150px]" title={doc.file.split('/').pop()}>{doc.file.split('/').pop()}</span>
              <FaHourglassHalf className="esg-text-yellow-500" />
            </li>
          ))}
        </ul>
      </div>

      {/* Checked Documentation */}
      <div>
        <h3 className="esg-text-sm esg-font-bold esg-text-gray-500 esg-uppercase esg-mb-3">Tjekket dokumentation</h3>
        <ul className="esg-space-y-2">
          {checkedDocs.length === 0 ? (
            <li className="esg-text-xs esg-text-gray-400 esg-italic">Ingen behandlede dokumenter</li>
          ) : checkedDocs.map(doc => (
            <li key={doc.id} className="esg-flex esg-flex-col esg-p-2 esg-bg-gray-50 esg-rounded esg-text-xs">
              <div className="esg-flex esg-items-center esg-justify-between">
                <span className="esg-truncate esg-max-w-[150px]" title={doc.file.split('/').pop()}>{doc.file.split('/').pop()}</span>
                {getStatusIcon(doc.status)}
              </div>
              {doc.admin_comment && (
                <p className="esg-mt-1 esg-text-[10px] esg-text-red-600 esg-italic">"{doc.admin_comment}"</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StepInitiativanalyse({ 
  activeIaGroup, iaAnswers, onIaAnswerChange, onNext, onPrev, isFirst, isLast, 
  onShowResults, polarBarChartData, totalScore, esgLevel, criterionColors, 
  marimekkoData, iaQuestions, companyId, year 
}) {
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [topicDocuments, setTopicDocuments] = useState([]);
  const [isMapping, setIsMapping] = useState(false);

  // Group questions by topic (e.g. "1.1 CO2 udledninger")
  const groupedQuestionsByTopic = useMemo(() => {
    return iaQuestions
      .filter(q => q.sub_category.label === activeIaGroup)
      .reduce((acc, question) => {
        (acc[question.topic] = acc[question.topic] || []).push(question);
        return acc;
      }, {});
  }, [activeIaGroup, iaQuestions]);

  // Handle open/close of topic sections
  useEffect(() => {
    setOpenSections(
      Object.keys(groupedQuestionsByTopic).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {})
    );
  }, [groupedQuestionsByTopic]);

  // Fetch documents for the current company/year
  const refreshDocuments = useCallback(async () => {
    try {
      const docs = await fetchDocuments({ company_id: companyId, year: year });
      setTopicDocuments(docs);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  }, [companyId, year]);

  useEffect(() => {
    if (companyId && year) refreshDocuments();
  }, [companyId, year, refreshDocuments]);

  // Calculate Documentation Progress for CURRENT active group
  const progressPercentage = useMemo(() => {
    const questionsInThisGroup = iaQuestions.filter(q => q.sub_category.label === activeIaGroup);
    const answeredInThisGroup = questionsInThisGroup.filter(q => iaAnswers[q.id]?.is_answered);
    
    if (answeredInThisGroup.length === 0) return 0;

    const documentedCount = answeredInThisGroup.filter(q => 
      iaAnswers[q.id]?.documents && iaAnswers[q.id].documents.length > 0
    ).length;

    return (documentedCount / answeredInThisGroup.length) * 100;
  }, [iaQuestions, activeIaGroup, iaAnswers]);

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDocMapping = async (questionId, docId) => {
    if (!docId) return;
    const answer = iaAnswers[questionId];
    if (!answer) {
        alert("Besvar venligst spørgsmålet først.");
        return;
    }

    setIsMapping(true);
    try {
      const answerId = answer.answer_id || answer.id;
      if (!answerId) {
        throw new Error("Svaret er ikke gemt i databasen endnu. Prøv at vente et øjeblik.");
      }

      // Toggle logic: if docId is already in documents, remove it, else add it
      const currentDocIds = (answer.documents || []).map(d => d.id);
      const newDocIds = currentDocIds.includes(docId)
        ? currentDocIds.filter(id => id !== docId)
        : [...currentDocIds, docId];

      const updatedAnswer = await mapDocumentsToAnswer(answerId, newDocIds);
      
      // Update local state via parent's onIaAnswerChange
      onIaAnswerChange(questionId, true, { ...answer, documents: updatedAnswer.documents });
    } catch (error) {
      alert(`Fejl ved mapping: ${error.message}`);
    } finally {
      setIsMapping(false);
    }
  };

  return (
    <div className="esg-grid esg-grid-cols-1 lg:esg-grid-cols-12 esg-gap-6">
      
      {/* COLUMN 1: QUESTIONS (6/12) */}
      <div className="lg:esg-col-span-6">
        <div className="esg-bg-white esg-p-6 esg-rounded-lg esg-shadow-md">
          <h1 className="esg-text-xl esg-font-bold esg-mb-6 esg-flex esg-items-center">
            {activeIaGroup}: {groupTitles[activeIaGroup]}
            <InfoIcon onClick={() => setIsCategoryDrawerOpen(true)} />
          </h1>

          {Object.entries(groupedQuestionsByTopic).map(([topic, questions]) => (
            <div key={topic} className="esg-mb-6 esg-border esg-border-gray-100 esg-rounded-lg">
              <button
                className="esg-flex esg-justify-between esg-items-center esg-w-full esg-p-3 esg-text-sm esg-font-bold esg-bg-gray-50 esg-rounded-t-lg"
                onClick={() => toggleSection(topic)}
              >
                <span>{topic}</span>
                <svg className={`esg-w-4 esg-h-4 esg-transition-transform ${openSections[topic] ? 'esg-rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              {openSections[topic] && (
                <div className="esg-p-4 esg-space-y-4">
                  {questions.map(q => {
                    const isAnswered = iaAnswers[q.id]?.is_answered || false;
                    const linkedDocs = iaAnswers[q.id]?.documents || [];
                    
                    return (
                      <div key={q.id} className="esg-bg-white esg-p-4 esg-rounded-lg esg-border esg-border-gray-50 esg-shadow-sm hover:esg-shadow-md esg-transition-shadow">
                        <div className="esg-flex esg-justify-between esg-items-start esg-mb-3">
                          <div className="esg-flex-1">
                            <p className="esg-text-[10px] esg-text-gray-400 esg-font-bold">{q.number}</p>
                            <p className="esg-text-sm esg-leading-snug">{q.text}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={isAnswered}
                            onChange={(e) => onIaAnswerChange(q.id, e.target.checked)}
                            className="esg-form-checkbox esg-h-5 esg-w-5 esg-text-blue-600 esg-ml-4 esg-flex-shrink-0"
                          />
                        </div>

                        {/* Dropdown for Mapping - Only show if answered */}
                        {isAnswered && (
                          <div className="esg-mt-4 esg-pt-3 esg-border-t esg-border-gray-50">
                            <div className="esg-flex esg-items-center esg-gap-1 esg-mb-2 esg-text-gray-500">
                              <FaLink className="esg-text-xs" />
                              <span className="esg-text-[10px] esg-font-bold esg-uppercase">Knyt dokumentation</span>
                            </div>
                            <select 
                                className="esg-w-full esg-text-xs esg-p-2 esg-border esg-rounded esg-bg-white focus:esg-ring-1 focus:esg-ring-blue-500"
                                onChange={(e) => handleDocMapping(q.id, parseInt(e.target.value))}
                                value=""
                                disabled={isMapping}
                            >
                                <option value="">Vælg fra uploadet dokumentation...</option>
                                {topicDocuments.filter(d => d.topic === topic).map(doc => (
                                    <option key={doc.id} value={doc.id}>
                                        {linkedDocs.some(ld => ld.id === doc.id) ? '✓ ' : '+ '} 
                                        {doc.file.split('/').pop()}
                                    </option>
                                ))}
                            </select>
                            
                            {linkedDocs.length > 0 && (
                                <div className="esg-flex esg-wrap esg-gap-1 esg-mt-2">
                                    {linkedDocs.map(ld => (
                                        <span key={ld.id} className="esg-inline-flex esg-items-center esg-px-2 esg-py-1 esg-rounded-full esg-bg-blue-50 esg-text-blue-700 esg-text-[9px]">
                                            {ld.file.split('/').pop()}
                                        </span>
                                    ))}
                                </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <div className="esg-flex esg-justify-between esg-mt-8">
            <button onClick={onPrev} className="btn-secondary">Forrige</button>
            {isLast ? (
              <button onClick={onShowResults} className="btn-primary">Vis Resultater</button>
            ) : (
              <button onClick={onNext} className="btn-primary">Næste</button>
            )}
          </div>
        </div>
      </div>

      {/* COLUMN 2: DOCUMENTATION SIDEBAR (2/12) */}
      <div className="lg:esg-col-span-2">
        <DocumentationSidebar 
            companyId={companyId} 
            year={year} 
            topic={Object.keys(groupedQuestionsByTopic)[0] || activeIaGroup}
            documents={topicDocuments}
            onUploadSuccess={refreshDocuments}
            progressPercentage={progressPercentage}
        />
      </div>

      {/* COLUMN 3: CHARTS (4/12) */}
      <div className="lg:esg-col-span-4">
        <div className="esg-sticky esg-top-8 esg-space-y-6">
          <div className="esg-bg-white esg-p-4 esg-rounded-lg esg-shadow-md">
            <CustomPolarChart data={polarBarChartData} totalScore={totalScore} esgLevel={esgLevel} criterionColors={criterionColors} />
          </div>
          <div className="esg-bg-white esg-p-4 esg-rounded-lg esg-shadow-md">
            <NivoLikeMarimekkoChart data={marimekkoData?.filter(item => 
              iaQuestions.find(q => q.topic === item.subcategory)?.sub_category.label === activeIaGroup
            ) || []} />
          </div>
        </div>
      </div>

      <Drawer isOpen={isCategoryDrawerOpen} onClose={() => setIsCategoryDrawerOpen(false)} title={`${activeIaGroup}: ${groupTitles[activeIaGroup]}`}>
        <p>{categoryDescriptions[activeIaGroup]?.description || 'Ingen beskrivelse tilgængelig.'}</p>
      </Drawer>
    </div>
  );
}

export default StepInitiativanalyse;