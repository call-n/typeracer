import { useEffect, useState } from 'react';
import AnimatedTransition from '../components/Layout/AnimatedTransition';
import {
  Flex,
  Box,
  Container,
  Heading,
  Stack,
  Text,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
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
} from '@chakra-ui/react';
import { db } from "../firebase";
import { collection, query, where, getDocs, orderBy, limit, onSnapshot } from "firebase/firestore";

const Leaderboard = () => {
    const [documents, setDocuments] = useState(null)
    const [error, setError] = useState(null)
    const ref = query(collection(db, "scoreboard"), orderBy("wpm", "desc"), limit(5));

    useEffect(() => {
        const unsubscribe = onSnapshot(ref, (snapshot) => {
            let results = []
            snapshot.docs.forEach(doc => {
              results.push({ id: doc.id , ...doc.data()})
            })
            
            setDocuments(results)
            setError(null)
          }, error => {
            console.log(error)
            setError('could not fetch the data')
          })
      
        return () => unsubscribe()
    },[ref])

    console.log(documents)

  return (
    <AnimatedTransition>
      <Container maxW={'5xl'} height='85vh' display='flex' justifyContent='center' alignItems='center'>
      <Stack
        textAlign={'center'}
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        >
        <Box>
            <Box padding="5rem">
                <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '2xl', sm: '4xl', lg: '5xl' }}>
                    All-time Leaderboards
                </Heading>
            </Box>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
                <Box>
                    <Text
                        fontSize={{ base: '18px', lg: '20px' }}
                        color={'green.300'}
                        fontWeight={'500'}
                        mb={'4'}
                        textAlign='left'>
                        Time 15 s
                    </Text>
                    <TableContainer>
                        <Table size='md' variant='simple'>
                            <TableCaption>Leaderboard for time 15s</TableCaption>
                            <Thead>
                            <Tr border="none">
                                <Th color='gray.500'>#</Th>
                                <Th paddingLeft='0' color='gray.500'>name</Th>
                                <Th textAlign='right' color='gray.500'>wpm <br /> <Box color='gray.600'>Accuracy%</Box></Th>
                                <Th isNumeric color='gray.500'>date</Th>
                            </Tr>
                            </Thead>
                            <Tbody>
                            {documents && (
                                documents.map((doc, index) => (
                                <Tr key={index+1}>
                                    <Td>{index+1}</Td>
                                    <Td paddingLeft='0'>{doc.name}</Td>
                                    <Td textAlign='right'>{doc.wpm} <br /> <Box color='gray.500'>{doc.acc}%</Box></Td>
                                    <Th textAlign='right' color='gray.500'>28 Oct 2023 <br /> <Box color='gray.600'>19.07</Box></Th>
                                </Tr>
                                ))
                            )}
                            </Tbody>
                            <Tfoot>
                            <Tr>
                                <Th color='gray.500'>#</Th>
                                <Th paddingLeft='0' color='gray.500'>name</Th>
                                <Th textAlign='right' color='gray.500'>wpm <br /> <Box color='gray.600'>Accuracy%</Box></Th>
                                <Th isNumeric color='gray.500'>date</Th>
                            </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                </Box>
                <Box>
                    <Text
                        fontSize={{ base: '18px', lg: '20px' }}
                        color={'green.300'}
                        fontWeight={'500'}
                        mb={'4'}
                        textAlign='left'>
                        Time 60 s
                    </Text>
                    <TableContainer>
                        <Table size='md' variant='simple'>
                            <TableCaption>Leaderboard for time 60s</TableCaption>
                            <Thead>
                            <Tr border="none">
                                <Th color='gray.500'>#</Th>
                                <Th paddingLeft='0' color='gray.500'>name</Th>
                                <Th textAlign='right' color='gray.500'>wpm <br /> <Box color='gray.600'>Accuracy%</Box></Th>
                                <Th isNumeric color='gray.500'>date</Th>
                            </Tr>
                            </Thead>
                            <Tbody>
                            {documents && (
                                documents.map((doc, index) => (
                                <Tr key={index+1}>
                                    <Td>{index+1}</Td>
                                    <Td paddingLeft='0'>{doc.name}</Td>
                                    <Td textAlign='right'>{doc.wpm} <br /> <Box color='gray.500'>{doc.acc}%</Box></Td>
                                    <Th textAlign='right' color='gray.500'>28 Oct 2023 <br /> <Box color='gray.600'>19.07</Box></Th>
                                </Tr>
                                ))
                            )}
                            </Tbody>
                            <Tfoot>
                            <Tr>
                                <Th color='gray.500'>#</Th>
                                <Th paddingLeft='0' color='gray.500'>name</Th>
                                <Th textAlign='right' color='gray.500'>wpm <br /> <Box color='gray.600'>Accuracy%</Box></Th>
                                <Th isNumeric color='gray.500'>date</Th>
                            </Tr>
                            </Tfoot>
                        </Table>
                    </TableContainer>
                </Box>
            </SimpleGrid>
        </Box>
      </Stack>
    </Container>
    </AnimatedTransition>
  )
}

export default Leaderboard