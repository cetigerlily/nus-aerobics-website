import PropTypes from "prop-types";

import { MdChevronLeft } from "react-icons/md";
import ClassForm from "../classes/ClassForm";
import { PageTitle } from "../utils/Titles";

export default function AdminClassCreatePage({ closeCreate }) {
  return (
    <>
      <div className="flex flex-row items-center gap-x-2.5">
        <button className="cursor-pointer" onClick={closeCreate}>
          <MdChevronLeft color="#1F4776" size={42} />
        </button>
        <PageTitle title="Create new class" />
      </div>
      <div className="h-full w-full flex flex-col gap-y-5 p-5 overflow-scroll rounded-[20px] border border-a-black/10 bg-white">
        <ClassForm
          isCreate={true}
          selectedClass={{
            name: "",
            description: "",
            date: "",
            maxCapacity: 19,
            bookedCapacity: 0,
            status: "open",
          }}
        />
      </div>
    </>
  );
}

AdminClassCreatePage.propTypes = {
  closeCreate: PropTypes.func,
};
