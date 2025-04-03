import React, { useRef, useState } from "react";
import { Modal } from "react-native-magnus";
import { MatchDetails } from "../../types/form.type";
import { QueryObserverResult } from "@tanstack/react-query";
import Match from "../../types/match.type";
import MatchForm from "../matche/Form/match";
//falta hacer un cambio que se muestre bien los datos actuales, estan hardcodeados
/* =======================================
   1) Declaramos la interfaz de props,
      incluyendo onMatchCreated
   ======================================= */
interface MatchModalHandlerProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  match?: Match;
  refetch: () => Promise<QueryObserverResult<any, Error>>;
  onMatchCreated?: (matchId: string) => void; // <-- MARCADO: Agregamos prop opcional
}

export default function MatchModalHandler({
  open,
  setOpen,
  match,
  refetch
}: MatchModalHandlerProps) {

  function closeModal() {
    setOpen(false);
  }

  const onEdit = () => {
    refetch()
    setOpen(false)
  }

  return (
    <Modal isVisible={open} onBackButtonPress={closeModal}>
      <MatchForm match={match} onRefetch={onEdit} />
    </Modal>
  );
}