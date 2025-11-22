package com.example.GerenciadorTarefas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.GerenciadorTarefas.model.Tarefa;

@Repository
public interface TarefaRepository extends JpaRepository<Tarefa, Long>{
    
}
