import React, { useState, useEffect } from "react";
import { Box, Button, Container, Flex, FormControl, FormLabel, Input, Text, VStack, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

const Index = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ name: "", description: "" });
  const [editingEvent, setEditingEvent] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const response = await fetch("http://localhost:1337/api/events");
    const data = await response.json();
    setEvents(data.data);
  };

  const handleInputChange = (e, field) => {
    setNewEvent({ ...newEvent, [field]: e.target.value });
  };

  const handleEditChange = (e, field) => {
    setEditingEvent({ ...editingEvent, [field]: e.target.value });
  };

  const addEvent = async () => {
    const response = await fetch("http://localhost:1337/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: newEvent }),
    });
    if (response.ok) {
      fetchEvents();
      setNewEvent({ name: "", description: "" });
      toast({
        title: "Event created.",
        description: "Your event has been successfully created.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const updateEvent = async () => {
    const response = await fetch(`http://localhost:1337/api/events/${editingEvent.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: editingEvent }),
    });
    if (response.ok) {
      fetchEvents();
      setEditingEvent(null);
      toast({
        title: "Event updated.",
        description: "Your event has been successfully updated.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const deleteEvent = async (id) => {
    const response = await fetch(`http://localhost:1337/api/events/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      fetchEvents();
      toast({
        title: "Event deleted.",
        description: "Your event has been successfully deleted.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.md" py={5}>
      <VStack spacing={4} align="stretch">
        <Box p={5} shadow="md" borderWidth="1px">
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input value={newEvent.name} onChange={(e) => handleInputChange(e, "name")} placeholder="Event Name" />
            <FormLabel mt={4}>Description</FormLabel>
            <Input value={newEvent.description} onChange={(e) => handleInputChange(e, "description")} placeholder="Event Description" />
            <Button leftIcon={<FaPlus />} mt={4} colorScheme="teal" onClick={addEvent}>
              Add Event
            </Button>
          </FormControl>
        </Box>
        {events.map((event) => (
          <Flex key={event.id} p={5} shadow="md" borderWidth="1px" justify="space-between" align="center">
            {editingEvent?.id === event.id ? (
              <>
                <VStack align="stretch">
                  <Input value={editingEvent.name} onChange={(e) => handleEditChange(e, "name")} placeholder="Event Name" />
                  <Input value={editingEvent.description} onChange={(e) => handleEditChange(e, "description")} placeholder="Event Description" />
                </VStack>
                <IconButton icon={<FaEdit />} onClick={updateEvent} colorScheme="blue" />
              </>
            ) : (
              <>
                <Box>
                  <Text fontWeight="bold">{event.attributes.name}</Text>
                  <Text fontSize="sm">{event.attributes.description}</Text>
                </Box>
                <IconButton icon={<FaEdit />} onClick={() => setEditingEvent({ id: event.id, ...event.attributes })} colorScheme="blue" />
                <IconButton icon={<FaTrash />} onClick={() => deleteEvent(event.id)} colorScheme="red" />
              </>
            )}
          </Flex>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;
