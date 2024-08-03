import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { PageTitle } from "../utils/Titles";
import {
  chipClassNames,
  chipTypes,
  inputClassNames,
  tableClassNames,
} from "../utils/ClassNames";
import { format } from "date-fns";
import { MdMoreVert } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { Chip, Input, Pagination } from "@nextui-org/react";
import Toast from "../Toast";

export default function AdminClassLandingPage({
  // classes,
  openCreate,
}) {
  const router = useRouter();

  const [classes, setClasses] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [selectedClass, setSelectedClass] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toast, setToast] = useState({});

  useEffect(() => {
    const fetchClasses = async () => {
      const res = await fetch("/api/classes");
      if (!res.ok) {
        throw new Error(`Unable to get classes: ${res.status}`);
      }
      const data = await res.json();
      setClasses(data);
    };
    fetchClasses();
  }, []);

  const rowsPerPage = 10;
  const classPages = useMemo(() => {
    if (searchInput != "") {
      const classesSearch = classes.filter((c) => {
        const className = c.name.toLowerCase();
        const searchValue = searchInput.toLowerCase();
        return className.includes(searchValue);
      });
      return Math.ceil(classesSearch.length / rowsPerPage);
    }
    return Math.ceil(classes.length / rowsPerPage);
  }, [classes, searchInput]);
  
  const classItems = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    if (searchInput != "") {
      const classesSearch = classes.filter((c) => {
        const className = c.name.toLowerCase();
        const searchValue = searchInput.toLowerCase();
        return className.includes(searchValue);
      });
      return classesSearch.slice(start, end);
    }
    return classes.slice(start, end);
  }, [page, classes, searchInput]);
  
  const toggleShowToast = () => {
    setShowToast(!showToast);
  };
  const selectRow = (rowData) => {
    console.log("selectedClass:", rowData);
    setSelectedClass(rowData);
  };
  const handleDropdown = (key) => {
    switch (key) {
      case "view":
        console.log("view");
        return router.push(`classes/${selectedClass.id}`);
      case "duplicate":
        // TODO: Implement duplciate class selected
        console.log("duplicate");
        return;
      case "delete":
        return deleteClass(selectedClass);
    }
  };

  async function deleteClass(selectedClass) {
    try {
      const originalBookings = await fetch(
        `/api/bookings?classId=${selectedClass.id}`
      );
      if (!originalBookings.ok) {
        throw new Error(
          `Unable to get original bookings for class ${selectedClass.id}`
        );
      }

      const res1 = await fetch("/api/bookings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: selectedClass.id }),
      });
      if (!res1.ok) {
        // TODO: Restore bookings for class
        throw new Error(
          `Unable to delete bookings for class ${selectedClass.id}`
        );
      }

      const updatedClasses = classes.filter((originalClass) => {
        return originalClass.id != selectedClass.id;
      });
      setClasses(updatedClasses);
      setToast({
        isSuccess: true,
        header: "Deleted class",
        message: `Successfully deleted ${selectedClass.name}.`,
      });
      setShowToast(true);
    } catch (error) {
      setResult({
        isSuccess: false,
        header: "Unable to delete class",
        message: `An error occurred while deleting ${selectedClass.name}. Try again later.`,
      });
      setModalType("result");
      console.log(error);}
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between">
        <PageTitle title="Classes" />
        <button
          onClick={openCreate}
          className="h-[36px] rounded-[30px] px-[20px] bg-a-navy text-white text-sm cursor-pointer"
        >
          Create
        </button>
      </div>
      {/* STARRED: This is how to do the pagination with overflow for 10 rows */}
      <div className="w-full flex flex-col p-5 rounded-[20px] border border-a-black/10 bg-white gap-y-2.5">
        <div className="self-end w-1/4">
          <Input
            placeholder="Search"
            value={searchInput}
            onValueChange={searchInput}
            variant="bordered"
            size="xs"
            classNames={inputClassNames}
          />
        </div>
        <Table removeWrapper classNames={tableClassNames}>
          <TableHeader>
            <TableColumn>Class</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Booked capacity</TableColumn>
            <TableColumn allowsSorting>Date</TableColumn>
            <TableColumn></TableColumn>
          </TableHeader>
          <TableBody>
            {classItems.map((item) => {
              return (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    <Chip classNames={chipClassNames[item.status]}>
                      {chipTypes[item.status].message}
                    </Chip>
                  </TableCell>
                  <TableCell>{`${item.bookedCapacity}/${item.maxCapacity}`}</TableCell>
                  <TableCell>{format(item.date, "d/MM/y HH:mm")}</TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <button
                          className="cursor-pointer"
                          onClick={() => selectRow(item)}
                        >
                          <MdMoreVert size={24} />
                        </button>
                      </DropdownTrigger>
                      <DropdownMenu onAction={(key) => handleDropdown(key)}>
                        <DropdownItem key="view">View class</DropdownItem>
                        <DropdownItem key="duplicate">
                          Duplicate class
                        </DropdownItem>
                        <DropdownItem key="delete">Delete class</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex flex-row justify-center">
          <Pagination
            showControls
            isCompact
            color="primary"
            size="sm"
            loop={true}
            page={page}
            total={classPages}
            onChange={(page) => setPage(page)}
          />
        </div>
      </div>
      {showToast ? (
        <div onClick={toggleShowToast}>
          <Toast
            isSuccess={toast.isSuccess}
            header={toast.header}
            message={toast.message}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

AdminClassLandingPage.propTypes = {
  classes: PropTypes.array,
  openCreate: PropTypes.func,
};
