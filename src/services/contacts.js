import Contact from '../models/contacts.js';

export const getContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  contactType,
  isFavourite,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  // const filter = {};

  // if (contactType) {
  //   filter.contactType = contactType;
  // }

  // if (isFavourite !== undefined) {
  //   filter.isFavourite = isFavourite === 'true';
  // }

  const [total, contacts] = await Promise.all([
    Contact.countDocuments(),
    Contact.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return {
    contacts,
    total,
    page,
    perPage,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: totalPages > page,
  };
};

export const getContactsById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};

export const deleteContact = async (id) => {
  const contact = await Contact.findByIdAndDelete(id);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await Contact.create(payload);
  return contact;
};

export const updateContact = async (id, payload) => {
  const contact = await Contact.findByIdAndUpdate(id, payload, { new: true });
  return contact;
};
