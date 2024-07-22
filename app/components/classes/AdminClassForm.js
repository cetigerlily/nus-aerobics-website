/**
 * Form for creating or editing a Class' details, handles creating the new entry or updating existing entry
 * @returns
 */
import PropTypes from "prop-types";

import { Input, Switch, Textarea } from "@nextui-org/react";
import { inputClassNames, switchClassNames } from "../ClassNames";
import { useState } from "react";
import { SectionTitle } from "../Titles";
import { z } from "zod";
import { format } from "date-fns";

export default function AdminClassForm({
  isCreate, // True or False, to determine whether to POST or UPDATE Class
  selectedClass,
}) {
  const [name, setName] = useState(selectedClass.name);
  const [date, setDate] = useState(
    selectedClass.date != "" ? format(selectedClass.date, "yyy-MM-dd") : ""
  );
  const [time, setTime] = useState(
    selectedClass.date != "" ? format(selectedClass.date, "HH:mm") : ""
  );
  const [description, setDescription] = useState(selectedClass.description);
  const [isOpenBooking, setIsOpenBooking] = useState(
    selectedClass.status == "open"
  );

  async function createClass() {
    // TODO: Fix timing issue since 19:00 becomes 18:00 - need to add timezone to inputs
    // TODO: Validate date and time input formats
    try {
      const newClass = {
        name: name,
        description: description,
        date: `${date} ${time}:00`,
        status: isOpenBooking ? "open" : "closed",
      };
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClass),
      });
      if (!res.ok) {
        throw new Error(`Unable to create new class: ${res.status}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function saveEdit() {
    try {
      const updatedClass = {
        id: selectedClass.id,
        name: name,
        description: description,
        date: `${date} ${time}:00`,
        maxCapacity: selectedClass.maxCapacity,
        bookedCapacity: selectedClass.bookedCapacity,
        status: isOpenBooking ? "open" : "closed",
      };
      const res = await fetch("/api/classes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedClass),
      });
      if (!res.ok) {
        throw new Error(`Unable to update class: ${res.status}`);
      }

      // TODO: Go back to ClassViewPage
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex flex-row justify-between">
        <SectionTitle title="Class details" />
        <button
          onClick={isCreate ? createClass : saveEdit}
          className="h-[36px] rounded-[30px] px-[20px] bg-a-navy text-white text-sm cursor-pointer" // PREVIOUSLY: py-[10px]
        >
          {isCreate ? "Create class" : "Save changes"}
        </button>
      </div>
      <div className="flex flex-col md:flex-row gap-2.5">
        <div className="md:w-1/3 flex flex-col gap-y-[5px]">
          <p className="text-a-black/50 text-sm">Class name *</p>
          <Input
            value={name}
            onValueChange={setName}
            isRequired
            variant="bordered"
            size="xs"
            classNames={inputClassNames}
          />
        </div>
        <div className="md:w-1/3 flex flex-col gap-y-[5px]">
          <p className="text-a-black/50 text-sm">Date *</p>
          {/* TODO: Figure out DateInput */}
          <Input
            value={date}
            onValueChange={setDate}
            isRequired
            variant="bordered"
            size="xs"
            classNames={inputClassNames}
          />
        </div>
        <div className="md:w-1/3 flex flex-col gap-y-[5px]">
          <p className="text-a-black/50 text-sm">Time *</p>
          <Input
            value={time}
            onValueChange={setTime}
            isRequired
            variant="bordered"
            size="xs"
            classNames={inputClassNames}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <Switch
          isSelected={isOpenBooking}
          onValueChange={setIsOpenBooking}
          size="sm"
          className="mb-2.5"
          classNames={switchClassNames}
        >
          Open for booking
        </Switch>
      </div>
      <div className="flex flex-col gap-y-[5px]">
        <p className="text-a-black/50 text-sm">Description</p>
        <Textarea
          value={description}
          onValueChange={setDescription}
          variant="bordered"
          classNames={{
            label: [
              "text-a-black/50",
              "group-data-[filled-within=true]:text-a-black/50",
            ],
            input: "bg-transparent text-sm text-a-black h-[200px]",
            innerWrapper: [
              "h-[200px]",
              "bg-transparent",
              "hover:bg-transparent",
            ],
            inputWrapper: [
              "bg-transparent",
              "h-[200px]",
              "rounded-[30px]",
              "border-[1px]",
              "border-a-black/10",
              "hover:border-a-black/10",
              "group-data-[focus=true]:border-a-black/10",
              "group-data-[hover=true]:border-a-black/10",
            ],
          }}
        />
      </div>
    </>
  );
}

AdminClassForm.propTypes = {
  isCreate: PropTypes.bool,
  selectedClass: PropTypes.object,
};