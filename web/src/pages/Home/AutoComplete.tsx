// import { ArrowUpIcon } from "@chakra-ui/icons";
// import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
// import React, { useMemo, useState } from "react";

// interface AutoCompleteProps {
//   options: {
//     tags: string[];
//     nextPage: {
//       take: number;
//       skip: number;
//     } | null;
//     hasMore: boolean;
//     count: number;
//   };
//   onSelect: (name: string) => void;
// }

// export const AutoComplete: React.FC<AutoCompleteProps> = ({
//   options,
//   onSelect,
// }) => {
//   const [input, setInput] = useState("");
//   const [isFocused, setIsFocused] = useState(false);
//   const [selectedIndex, setSelectedIndex] = useState(-1);

//   const filteredOptions = useMemo(
//     () =>
//       options.tags.filter(
//         (tag) =>
//           tag.name.toLowerCase().includes(input.trim()) && input.trim() !== ""
//       ),
//     [input, options]
//   );

//   return (
//     <Flex mt="8" alignItems={"flex-start"}>
//       <Button
//         onClick={() => {
//           onSelect(input);
//         }}
//         mt="2"
//         mr="4"
//         size={"sm"}
//         variant={"outline"}
//       >
//         <ArrowUpIcon />
//       </Button>
//       <Box>
//         <Input
//           onFocus={() => {
//             setIsFocused(true);
//           }}
//           onBlur={() => {
//             setIsFocused(false);
//           }}
//           w={"100%"}
//           variant={"flushed"}
//           autoComplete="on"
//           value={input}
//           onChange={(e) => {
//             setInput(e.target.value);
//           }}
//           onKeyDown={(e) => {
//             if (e.key === "ArrowUp" && selectedIndex >= 0) {
//               e.preventDefault();
//               setSelectedIndex(selectedIndex - 1);
//             } else if (e.key === "ArrowDown") {
//               if (selectedIndex < filteredOptions.length - 1) {
//                 e.preventDefault();
//                 setSelectedIndex(selectedIndex + 1);
//               }
//             } else if (e.key === "Enter") {
//               if (selectedIndex === -1) {
//                 onSelect(input);
//               } else {
//                 if (!!filteredOptions[selectedIndex])
//                   onSelect(filteredOptions[selectedIndex]!.name);
//               }
//               setInput("");
//               setSelectedIndex(-1);
//             } else {
//               setSelectedIndex(-1);
//             }
//           }}
//         />
//         {filteredOptions.length > 0 && isFocused && (
//           <Box
//             maxHeight={"30vh"}
//             overflowY="scroll"
//             bg={"gray.800"}
//             mt="2"
//             ml="-3"
//             cursor={"pointer"}
//             borderRadius={"md"}
//           >
//             {filteredOptions.map((option, idx) => (
//               <Text
//                 borderTopRadius={idx === 0 ? "md" : undefined}
//                 borderBottomRadius={
//                   idx === filteredOptions.length - 1 ? "md" : undefined
//                 }
//                 bg={selectedIndex === idx ? "gray.600" : undefined}
//                 userSelect={"none"}
//                 px="3"
//                 py="2"
//                 key={idx}
//                 onMouseEnter={() => {
//                   setSelectedIndex(idx);
//                 }}
//                 onMouseLeave={() => {
//                   setSelectedIndex(-1);
//                 }}
//               >
//                 {option}
//               </Text>
//             ))}
//           </Box>
//         )}
//       </Box>
//     </Flex>
//   );
// };
