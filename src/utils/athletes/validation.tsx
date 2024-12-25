import { REGEX, USER_ERROR } from "@/utils/constants";
import _ from "lodash";
import moment from "moment";

export const useFormValidation = (formData: any, setErrors: any) => {
  const validate = () => {
    const newErrors: any = {};
    if (_.isEmpty(formData.personalEmail)) {
      newErrors.personalEmail = USER_ERROR.PERSONAL_EMAIL_REQUIRED;
    } else if (!REGEX.EMAIL.test(formData.personalEmail)) {
      newErrors.personalEmail = USER_ERROR.EMAIL_INVALID;
    }
    if (_.isEmpty(formData.dubaiPoliceEmail)) {
      newErrors.dubaiPoliceEmail = USER_ERROR.GOVERNMENT_EMAIL_REQUIRED;
    } else if (!REGEX.GOVERMENT_EMAIL.test(formData.dubaiPoliceEmail)) {
      newErrors.dubaiPoliceEmail = "Enter the Valid Dubai police email id example: adam@dubaipolice.gov.ae ";
    }
    if (!formData.residence || _.trim(formData.residence) === "") {
      newErrors.residence = USER_ERROR.RESIDENCE_REQUIRED;
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.residence)) {
      newErrors.residence = "Residence should not contain special characters."
    }
    if (!formData.phoneNo || _.trim(formData.phoneNo) === "") {
      newErrors.phoneNo = USER_ERROR.PHONE_NUMBER_REQUIRED;
    } else if (!/^\d+$/.test(formData.phoneNo)) {
      newErrors.phoneNo = USER_ERROR.INVALID_PHONE_NUMBER;
    }
    if (!formData.emergencyContactName || _.trim(formData.emergencyContactName) === "") {
      newErrors.emergencyContactName = USER_ERROR.EMERGENCY_CONTACT_NAME_REQUIRED;
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.emergencyContactName)) {
      newErrors.emergencyContactName = "Emergency Contact Name should not contain special characters."
    }
    if (!formData.emergencyContactNumber || _.trim(formData.emergencyContactNumber) === "") {
      newErrors.emergencyContactNumber = USER_ERROR.EMERGENCY_CONTACT_NUMBER_REQUIRED;
    } else if (!/^\d+$/.test(formData.emergencyContactNumber)) {
      newErrors.emergencyContactNumber = USER_ERROR.INVALID_PHONE_NUMBER;
    }
    setErrors(newErrors);
    return newErrors;
  };
  return { validate };
};

export const PersonalFormValidation = (formData: any, setErrors: any) => {
  const dobMoment = moment(formData.dob, "DD-MM-YYYY", true);
  const validate = () => {
    const newErrors: any = {};
    if (!formData.firstName || _.trim(formData.firstName) === "") {
      newErrors.firstName = USER_ERROR.F_NAME;
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.firstName)) {
      newErrors.firstName = "First name should not contain special characters.";
    }
    if (!formData.surname || _.trim(formData.surname) === "") {
      newErrors.surname = USER_ERROR.L_NAME;
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.surname)) {
      newErrors.surname = "Last name should not contain special characters.";
    }

    if (!formData.middleName || _.trim(formData.middleName) === "") {
      newErrors.middleName = USER_ERROR.M_NAME;
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.middleName)) {
      newErrors.middleName = "Middle name should not contain special characters.";
    }
    if (!formData.nationality || _.trim(formData.nationality) === "") {
      newErrors.nationality = USER_ERROR.NATIONALITY;
    } else if (!/^[a-zA-Z\u0600-\u06FF\s]+$/.test(formData.nationality)) {
      newErrors.nationality = "Nationality should not contain special characters.";
    }
    if (_.isEmpty(formData.gender)) {
      newErrors.gender = USER_ERROR.GENDER;
    }
    if (_.isEmpty(formData.dob)) {
      newErrors.dob = USER_ERROR.DOB;
    } else if (dobMoment.isAfter(moment())) {
      newErrors.dob = "Date of birth cannot be in the future.";
    } else if (dobMoment.isAfter(moment().subtract(18, "years"))) {
      newErrors.dob = USER_ERROR.EIGHTEENYEARSDOB;
    } else if (dobMoment.isBefore(moment().subtract(80, "years"))) {
      newErrors.dob = USER_ERROR.SIXTYYEARS;
    }

    setErrors(newErrors);
    return newErrors;
  };
  return { validate };
};

export const ProfessionalFormValidation = (formData: any, setErrors: any) => {
  const validate = () => {
    const newErrors: any = {};
    if (!formData.role || _.trim(formData.role) === "") {
      newErrors.role = USER_ERROR.ROLE;
    }
    if (_.isEmpty(formData.academicQualification)) {
      newErrors.academicQualification = USER_ERROR.QUALIFICATION;
    }
    if (!formData.currentJobPosition || _.trim(formData.currentJobPosition) === "") {
      newErrors.currentJobPosition = USER_ERROR.CURRENT_JOB_POSITION;
    }
    if (!formData.currentJobLocation || _.trim(formData.currentJobLocation) === "") {
      newErrors.currentJobLocation = USER_ERROR.CURRENT_JOB_LOCATION;
    }
    if (_.isEmpty(formData.dpEmployeeNumber)) {
      newErrors.dpEmployeeNumber = USER_ERROR.POLICE_EMPLOYEE_NUMBER;
    }

    if (!formData.rank || _.trim(formData.rank) === "") {
      newErrors.rank = USER_ERROR.RANK; // Error: Rank is required
    } else if (!/^(?=.*[a-zA-Z\u0600-\u06FF])[a-zA-Z\u0600-\u06FF0-9\s]+$/.test(formData.rank)) {
      newErrors.rank = USER_ERROR.RANK_VALIDATE; // Error: Must contain valid letters and optional numbers
    }

    if (_.isEmpty(formData.department)) {
      newErrors.department = USER_ERROR.DEPARTMENT;
    }
    if (_.isEmpty(formData.sportsCategory)) {
      newErrors.sportsCategory = USER_ERROR.SPORT_CATEGORY;
    }
    if (_.isEmpty(formData.dpEmploymentStatus)) {
      newErrors.dpEmploymentStatus = USER_ERROR.DP_EMPLOYMENT_STATUS;
    }
    if (!formData.disciplinePracticed || _.trim(formData.disciplinePracticed) === "") {
      newErrors.disciplinePracticed = USER_ERROR.DISCIPLINE;
    }
    if (_.isEmpty(formData.performanceLevel)) {
      newErrors.performanceLevel = USER_ERROR.PERFORMANCE;
    }
    if (_.isEmpty(formData.pledgeDate)) {
      newErrors.pledgeDate = USER_ERROR.PLEDGE_DATE;
    }
    if (_.isEmpty(formData.contractType)) {
      newErrors.contractType = USER_ERROR.CONTRACT_TYPE;
    }
    if (_.isEmpty(formData.acknowledgementDate)) {
      newErrors.acknowledgementDate = USER_ERROR.ACKNOWLEDGEMENT_DATE;
    }
    setErrors(newErrors);
    return newErrors;
  };

  return { validate };
};


export const PhysicalAndMedicalFormValidation = (formData: any, setErrors: any) => {
  const validate = () => {
    const newErrors: any = {};
    if (_.isEmpty(formData.height) || isNaN(Number(formData.height))) {
      newErrors.height = "Height is required and must be a valid number.";
    }
    if (_.isEmpty(formData.weight) || isNaN(Number(formData.weight))) {
      newErrors.weight = "Weight is required and must be a valid number.";
    }
    if (_.isEmpty(formData.bloodType)) {
      newErrors.bloodType = 'Blood type is required.';
    }
    if (_.isEmpty(formData.sizeOfShoe)) {
      newErrors.sizeOfShoe = 'Shoe size is required.';
    }

    if (_.isEmpty(formData.sizeOfJersey)) {
      newErrors.sizeOfJersey = 'Jersey size is required.';
    }

    if (_.isEmpty(formData.sizeOfHelmet)) {
      newErrors.sizeOfHelmet = 'Helmet size is required.';
    }

    if (_.isEmpty(formData.sizeOfGloves)) {
      newErrors.sizeOfGloves = 'Gloves size is required.';
    }

    if (_.isEmpty(formData.sizeOfTrousers)) {
      newErrors.sizeOfTrousers = 'Trousers size is required.';
    }
    setErrors(newErrors);
    return newErrors;
  };

  return { validate };
};
