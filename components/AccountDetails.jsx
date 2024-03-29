import { useState, useEffect } from "react";
import AnimatedTransition from "./Layout/AnimatedTransition";
import {
  Text,
  List,
  ListItem,
  Box,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { useUserContext } from "../contexts/UserContext";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  limit,
  onSnapshot,
} from "firebase/firestore";

const AccountDetails = () => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  const { currentUser } = useUserContext();

  const ref = query(
    collection(db, "scoreboard"),
    where("user", "==", `${currentUser.uid}`),
    limit(5)
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() });
        });

        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
      <Box>
        <Text
          fontSize={{ base: "16px", lg: "18px" }}
          color={"green.300"}
          fontWeight={"500"}
          textTransform={"uppercase"}
          mb={"4"}
        >
          Account Details
        </Text>

        <List spacing={2}>
          <ListItem>
            <Text as={"span"} fontWeight={"bold"}>
              Display name:
            </Text>{" "}
            {currentUser.displayName}
          </ListItem>
          <ListItem>
            <Text as={"span"} fontWeight={"bold"}>
              Email:
            </Text>{" "}
            {currentUser.email}
          </ListItem>
        </List>
      </Box>
      <Box>
        <Box>
          <Text
            fontSize={{ base: "18px", lg: "20px" }}
            color={"green.300"}
            fontWeight={"500"}
            mb={"4"}
            textAlign="left"
          >
            History
          </Text>
          <TableContainer>
            <Table size="md" variant="simple">
              <TableCaption>History time table</TableCaption>
              <Thead>
                <Tr border="none">
                  <Th color="gray.500">#</Th>
                  <Th paddingLeft="0" color="gray.500">
                    name
                  </Th>
                  <Th textAlign="right" color="gray.500">
                    wpm <br /> <Box color="gray.600">Accuracy%</Box>
                  </Th>
                  <Th isNumeric color="gray.500">
                    date
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {documents &&
                  documents.map((doc, index) => (
                    <Tr key={index + 1}>
                      <Td>{index + 1}</Td>
                      <Td paddingLeft="0">{doc.name}</Td>
                      <Td textAlign="right">
                        {doc.wpm} <br /> <Box color="gray.500">{doc.acc}%</Box>
                      </Td>
                      <Th textAlign="right" color="gray.500">
                        {doc?.timeDate ? doc.timeDate : "2023-01-01"} <br />{" "}
                        <Box color="gray.600">
                          {doc?.timeStamp ? doc.timeStamp : "01:01:01"}
                        </Box>
                      </Th>
                    </Tr>
                  ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th color="gray.500">#</Th>
                  <Th paddingLeft="0" color="gray.500">
                    name
                  </Th>
                  <Th textAlign="right" color="gray.500">
                    wpm <br /> <Box color="gray.600">Accuracy%</Box>
                  </Th>
                  <Th isNumeric color="gray.500">
                    date
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </SimpleGrid>
  );
};

export default AccountDetails;
