import SimpleSchema from 'simpl-schema';
import BaseCollection from '/imports/api/base/BaseCollection';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';

/** @module FlairCollection */

/**
 * Represents a specific interest, such as "Software Engineering".
 * @extends module:Base~BaseCollection
 */
class FlairCollection extends BaseCollection {

  /**
   * Creates the FlairCollection collection.
   */
  constructor() {
    super('FlairCollection', new SimpleSchema({
      name: { type: String },
      description: { type: String, optional: true },
    }, { tracker: Tracker }));
  }

  /**
   * Defines a new FlairCollection.
   * @example
   * Flairs.define({ name: 'Software Engineering',
   *                    description: 'Methods for group development of large, high quality software systems' });
   * @param { Object } description Object with keys name and description.
   * Name must be previously undefined. Description is optional.
   * Creates a "slug" for this name and stores it in the slug field.
   * @throws {Meteor.Error} If the interest definition includes a defined name.
   * @returns The newly created docID.
   */
  define({ name, description }) {
    check(name, String);
    check(description, String);
    if (this.find({ name }).count() > 0) {
      throw new Meteor.Error(`${name} is previously defined in another FlairCollection`);
    }
    return this._collection.insert({ name, description });
  }

  /**
   * Returns the FlairCollection name corresponding to the passed interest docID.
   * @param interestID An interest docID.
   * @returns { String } An interest name.
   * @throws { Meteor.Error} If the interest docID cannot be found.
   */
  findName(interestID) {
    this.assertDefined(interestID);
    return this.findDoc(interestID).name;
  }

  /**
   * Returns a list of FlairCollection names corresponding to the passed list of FlairCollection docIDs.
   * @param interestIDs A list of FlairCollection docIDs.
   * @returns { Array }
   * @throws { Meteor.Error} If any of the instanceIDs cannot be found.
   */
  findNames(interestIDs) {
    return interestIDs.map(interestID => this.findName(interestID));
  }

  /**
   * Throws an error if the passed name is not a defined FlairCollection name.
   * @param name The name of an interest.
   */
  assertName(name) {
    this.findDoc(name);
  }

  /**
   * Throws an error if the passed list of names are not all FlairCollection names.
   * @param names An array of (hopefully) FlairCollection names.
   */
  assertNames(names) {
    _.each(names, name => this.assertName(name));
  }

  /**
   * Returns the docID associated with the passed FlairCollection name, or throws an error if it cannot be found.
   * @param { String } name An interest name.
   * @returns { String } The docID associated with the name.
   * @throws { Meteor.Error } If name is not associated with an FlairCollection.
   */
  findID(name) {
    return (this.findDoc(name)._id);
  }

  /**
   * Returns the docIDs associated with the array of FlairCollection names, or throws an error if any name cannot be found.
   * If nothing is passed, then an empty array is returned.
   * @param { String[] } names An array of interest names.
   * @returns { String[] } The docIDs associated with the names.
   * @throws { Meteor.Error } If any instance is not an FlairCollection name.
   */
  findIDs(names) {
    return (names) ? names.map((instance) => this.findID(instance)) : [];
  }

  /**
   * Returns an object representing the FlairCollection docID in a format acceptable to define().
   * @param docID The docID of an FlairCollection.
   * @returns { Object } An object representing the definition of docID.
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const name = doc.name;
    const description = doc.description;
    return { name, description };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Flairs = new FlairCollection();
