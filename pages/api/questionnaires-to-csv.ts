import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { Db } from 'mongodb';
import { createObjectCsvStringifier } from 'csv-writer';

import database from '../../middleware/db';
import { year } from '../../db';

import { withAuth } from '../../utils/withAuth';

interface ExtendedRequest extends NextApiRequest {
  db: Db;
  query: {
    [key: string]: string | string[];
  };
}

const options = {
  ['exceeded_expectations']: 'Exceeded Expectations',
  ['above_expectations']: 'Above Expectations',
  ['met_expectations']: 'Met Expectations',
  ['below_expectations']: 'Below Expectations',
  ['did_not_meet_expectations']: 'Did Not Meet Expectations',
  ['not_applicable']: 'Not Applicable',
};

const handler = nc<ExtendedRequest, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    // c: 'kaukauna' | 'plymouth';
    const { c } = req.query;

    const yearData = await year.getYear(req.db, '2023');

    if (!yearData) {
      throw new Error('Failed to find the year');
    }

    const questionnaires = yearData.questionnaires.filter(q => q.camp === c);

    // CSV headers
    const csvStringifier = createObjectCsvStringifier({
      header: [
        // OFFICIAL
        { id: 'officialName', title: 'Name' },
        { id: 'sessionName', title: 'Session' },
        // OVERALL EXPERIENCE
        { id: 'registration', title: 'Online Registration' },
        { id: 'checkin', title: 'Check-in Process' },
        { id: 'facility', title: 'Facility/Accomodations' },
        { id: 'classroom', title: 'Classroom Sessions' },
        { id: 'clinicians', title: 'Clinicians' },
        { id: 'competition', title: 'Game Competition Level' },
        { id: 'film', title: 'Game Film Study' },
        { id: 'director', title: 'Director Communication' },
        { id: 'meals', title: 'Meals - Snack/Lunch/Dinner' },
        { id: 'overallComments', title: 'Overall Comments' },
        { id: 'overallImprovements', title: 'Improvements' },
        // CLASSROOM CLINICIANS
        { id: 'classMaterials', title: 'Quality of Materials' },
        { id: 'classInterpersonalSkills', title: 'Interpersonal Skills' },
        { id: 'knowledgeLevel', title: 'Knowledge Level' },
        { id: 'sessionOrganization', title: 'Organization of Session' },
        { id: 'materialRelevance', title: 'Relevance of Material' },
        { id: 'favoriteClass', title: 'Favorite Class' },
        {
          id: 'classClinicians',
          title: 'Additional Comments On Classroom',
        },
        { id: 'topicSuggestions', title: 'Class Topic Suggestions' },
        // ON-COURT CLINICIANS
        { id: 'evaluationQuality', title: 'Quality of Evaluations' },
        { id: 'courtInterpersonalSkills', title: 'Interpersonal Skills' },
        { id: 'receptive', title: 'Receptive to Questions/Needs' },
        { id: 'reinforcement', title: 'Reinforcement from Classroom' },
        { id: 'raise', title: 'Helped Raise My Game Level' },
        { id: 'helpfulClinician', title: 'Most Helpful Clinician' },
        {
          id: 'onCourtAdditionalComments',
          title: 'On-Court Additional Comments',
        },
        { id: 'testimonial', title: 'Testimonial' },
      ],
    });

    // CSV records
    const records = questionnaires.map(q => {
      return {
        // OFFICIAL
        officialName: q.official.name,
        sessionName: q.official.session.name,
        // OVERALL EXPERIENCE
        registration: options[q.overall.registration],
        checkin: options[q.overall.checkin],
        facility: options[q.overall.facility],
        classroom: options[q.overall.classroom],
        clinicians: options[q.overall.clinicians],
        competition: options[q.overall.competition],
        film: options[q.overall.film],
        director: options[q.overall.communication],
        meals: options[q.overall.meals],
        overallComments: q.overall.comments, // textarea
        overallImprovements: q.overall.improvements, // textarea
        // CLASSROOM CLINICIANS
        classMaterials: options[q.classroom.materials],
        classInterpersonalSkills: options[q.classroom.interpersonal],
        knowledgeLevel: options[q.classroom.knowledge],
        sessionOrganization: options[q.classroom.organization],
        materialRelevance: options[q.classroom.relevance],
        favoriteClass: q.classroom.favorite, // textarea
        classClinicians: q.classroom.comments, // textarea
        topicSuggestions: q.classroom.topics, // textarea
        // ON-COURT CLINICIANS
        evaluationQuality: options[q.oncourt.evaluations],
        courtInterpersonalSkills: options[q.oncourt.interpersonal],
        receptive: options[q.oncourt.receptiveness],
        reinforcement: options[q.oncourt.reinforcement],
        raise: options[q.oncourt.raise],
        helpfulClinician: q.oncourt.clinician, // textarea
        onCourtAdditionalComments: q.oncourt.comments, // textarea
        testimonial: q.testimonial, // textarea
      };
    });

    const headerCategoriesRow = {
      officialName: 'OFFICIAL',
      sessionName: '',
      registration: 'OVERALL',
      checkin: '',
      facility: '',
      classroom: '',
      clinicians: '',
      competition: '',
      film: '',
      director: '',
      meals: '',
      overallComments: '',
      overallImprovements: '',
      classMaterials: 'CLASSROOM',
      classInterpersonalSkills: '',
      knowledgeLevel: '',
      sessionOrganization: '',
      materialRelevance: '',
      favoriteClass: '',
      classClinicians: '',
      topicSuggestions: '',
      evaluationQuality: '',
      courtInterpersonalSkills: 'ON-COURT',
      receptive: '',
      reinforcement: '',
      raise: '',
      helpfulClinician: '',
      onCourtAdditionalComments: '',
      testimonial: 'CAMP TESTIMONIAL',
    };

    const csv = `${csvStringifier.stringifyRecords([
      headerCategoriesRow,
    ])} ${csvStringifier.getHeaderString()} ${csvStringifier.stringifyRecords(
      records
    )}`;

    res.json({ csv });
  });

export default withAuth(handler);
